#!/bin/bash
set -e

# Log all output
exec > >(tee /var/log/user-data.log) 2>&1
echo "Starting user data script at $(date)"

# Update system packages
dnf update -y

# Install Docker
dnf install -y docker git

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -aG docker ec2-user

# Install Docker Compose
DOCKER_COMPOSE_VERSION="v2.24.0"
curl -L "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create symlink for docker compose command
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Create application directory
APP_DIR="/home/ec2-user/app"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone the repository (using HTTPS for public repos)
# If private, you'll need to set up SSH keys or use a token
git clone https://github.com/your-username/Smart-Job-Tracker.git . || {
    echo "Git clone failed - creating placeholder structure"
    mkdir -p backend frontend
}

# Create .env file with secrets
cat > $APP_DIR/.env << 'EOF'
# Database Configuration
DB_USER=${db_user}
DB_PASSWORD=${db_password}
DB_HOST=db
DB_PORT=3306
DB_NAME=${db_name}

# JWT Configuration
JWT_SECRET=${jwt_secret}
JWT_ALGORITHM=HS256
TOKEN_EXPIRE_MINUTES=30

# API Key
GROQ_API_KEY=${groq_api_key}

# MYSQL Connection
MYSQL_ROOT_PASSWORD=${db_password}
MYSQL_DATABASE=${db_name}
MYSQL_PASSWORD=${db_password}

# User id
MCP_USER_ID=6
BACKEND_BASE_URL=http://127.0.0.1:8001
EOF

# Set proper ownership
chown -R ec2-user:ec2-user $APP_DIR

# Create a deployment script for easy updates
cat > /home/ec2-user/deploy.sh << 'DEPLOY_EOF'
#!/bin/bash
cd /home/ec2-user/app
git pull origin main
docker-compose down
docker-compose up -d --build
docker-compose logs -f
DEPLOY_EOF
chmod +x /home/ec2-user/deploy.sh
chown ec2-user:ec2-user /home/ec2-user/deploy.sh

# Create a status script
cat > /home/ec2-user/status.sh << 'STATUS_EOF'
#!/bin/bash
echo "=== Docker Containers ==="
docker ps -a
echo ""
echo "=== Docker Compose Status ==="
cd /home/ec2-user/app && docker-compose ps
echo ""
echo "=== Recent Logs ==="
cd /home/ec2-user/app && docker-compose logs --tail=20
STATUS_EOF
chmod +x /home/ec2-user/status.sh
chown ec2-user:ec2-user /home/ec2-user/status.sh

echo "User data script completed at $(date)"
echo "Application directory: $APP_DIR"
echo "To deploy: Run 'cd /home/ec2-user/app && docker-compose up -d --build'"
