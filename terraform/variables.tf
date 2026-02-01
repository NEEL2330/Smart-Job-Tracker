# AWS Configuration
variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "security_group_id" {
  description = "ID of the existing security group"
  type        = string
  default     = "sg-0d91cd88e1d844148"
}

variable "key_pair_name" {
  description = "Name of the existing EC2 key pair"
  type        = string
  default     = "smart-ai-job-tracker"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

# Project Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "smart-job-tracker"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# Application Secrets
variable "db_password" {
  description = "MySQL database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "groq_api_key" {
  description = "Groq API key"
  type        = string
  sensitive   = true
  default     = ""
}

# Database Configuration
variable "db_name" {
  description = "MySQL database name"
  type        = string
  default     = "smart_job_tracker"
}

variable "db_user" {
  description = "MySQL database username"
  type        = string
  default     = "root"
}
