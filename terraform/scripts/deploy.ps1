<#
.SYNOPSIS
    Deploy Smart Job Tracker to AWS EC2 instance

.DESCRIPTION
    This script builds Docker images locally, transfers them to the EC2 instance,
    and restarts the application using Docker Compose.

.PARAMETER EC2Host
    The public IP or DNS of the EC2 instance

.PARAMETER KeyPath
    Path to the SSH private key file (.pem)

.EXAMPLE
    .\deploy.ps1 -EC2Host "13.127.xxx.xxx" -KeyPath "C:\path\to\smart-ai-job-tracker.pem"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2Host,
    
    [Parameter(Mandatory=$true)]
    [string]$KeyPath,
    
    [string]$SSHUser = "ec2-user",
    [string]$AppDir = "/home/ec2-user/app"
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Step { param($Message) Write-Host "`n==> $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# Get project root (go up from terraform/scripts)
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host " Smart Job Tracker - AWS Deployment" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Yellow

Write-Host "EC2 Host: $EC2Host"
Write-Host "Key File: $KeyPath"
Write-Host "Project Root: $ProjectRoot"

# Verify key file exists
if (-not (Test-Path $KeyPath)) {
    Write-Error "SSH key file not found: $KeyPath"
    exit 1
}

# SSH and SCP commands
$SSHCmd = "ssh -i `"$KeyPath`" -o StrictHostKeyChecking=no $SSHUser@$EC2Host"
$SCPCmd = "scp -i `"$KeyPath`" -o StrictHostKeyChecking=no"

# Step 1: Test SSH connection
Write-Step "Testing SSH connection..."
try {
    Invoke-Expression "$SSHCmd 'echo Connection successful'"
    Write-Success "SSH connection verified"
} catch {
    Write-Error "Failed to connect via SSH. Check your key and security group settings."
    exit 1
}

# Step 2: Create app directory on EC2
Write-Step "Setting up application directory on EC2..."
Invoke-Expression "$SSHCmd 'mkdir -p $AppDir'"

# Step 3: Copy application files
Write-Step "Copying application files to EC2..."

# Create a temporary archive
$TempArchive = "$env:TEMP\smart-job-tracker-deploy.tar.gz"

Push-Location $ProjectRoot
try {
    # Create tar archive excluding unnecessary files
    Write-Host "Creating deployment archive..."
    tar -czf $TempArchive `
        --exclude='.git' `
        --exclude='node_modules' `
        --exclude='venv' `
        --exclude='__pycache__' `
        --exclude='.env' `
        --exclude='terraform/.terraform' `
        --exclude='terraform/*.tfstate*' `
        --exclude='terraform/terraform.tfvars' `
        .
    
    Write-Success "Archive created: $TempArchive"
    
    # Copy archive to EC2
    Write-Host "Uploading to EC2..."
    Invoke-Expression "$SCPCmd `"$TempArchive`" $SSHUser@${EC2Host}:$AppDir/deploy.tar.gz"
    Write-Success "Upload complete"
    
    # Extract on EC2
    Write-Host "Extracting files on EC2..."
    Invoke-Expression "$SSHCmd 'cd $AppDir && tar -xzf deploy.tar.gz && rm deploy.tar.gz'"
    Write-Success "Files extracted"
} finally {
    Pop-Location
    if (Test-Path $TempArchive) {
        Remove-Item $TempArchive
    }
}

# Step 4: Copy .env file if it exists locally
$LocalEnvFile = Join-Path $ProjectRoot ".env"
if (Test-Path $LocalEnvFile) {
    Write-Step "Copying .env file..."
    Invoke-Expression "$SCPCmd `"$LocalEnvFile`" $SSHUser@${EC2Host}:$AppDir/.env"
    Write-Success ".env file copied"
} else {
    Write-Host "[WARN] No local .env file found. Make sure .env exists on EC2." -ForegroundColor Yellow
}

# Step 5: Build and start containers
Write-Step "Building and starting Docker containers..."
$DockerCommands = @"
cd $AppDir
docker-compose down --remove-orphans 2>/dev/null || true
docker-compose up -d --build
echo ''
echo 'Container Status:'
docker-compose ps
"@

Invoke-Expression "$SSHCmd '$DockerCommands'"

# Step 6: Show final status
Write-Step "Deployment complete!"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " Deployment Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nApplication URLs:"
Write-Host "  Frontend: http://$EC2Host" -ForegroundColor Cyan
Write-Host "  Backend:  http://${EC2Host}:8001" -ForegroundColor Cyan
Write-Host "  API Docs: http://${EC2Host}:8001/docs" -ForegroundColor Cyan
Write-Host "`nSSH Access:"
Write-Host "  ssh -i `"$KeyPath`" $SSHUser@$EC2Host" -ForegroundColor Yellow
Write-Host "`nUseful Commands (on EC2):"
Write-Host "  ./status.sh     - Check container status"
Write-Host "  ./deploy.sh     - Pull latest and redeploy"
Write-Host "  docker-compose logs -f  - View logs`n"
