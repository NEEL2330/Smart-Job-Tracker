# EC2 Instance for Smart Job Tracker
resource "aws_instance" "app_server" {
  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = true

  # Use first available subnet
  subnet_id = data.aws_subnets.default.ids[0]

  # Root volume configuration
  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # User data script to bootstrap Docker and the application
  user_data = base64encode(templatefile("${path.module}/scripts/user_data.sh", {
    db_password  = var.db_password
    db_name      = var.db_name
    db_user      = var.db_user
    jwt_secret   = var.jwt_secret
    groq_api_key = var.groq_api_key
  }))

  tags = {
    Name        = "${var.project_name}-server"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }

  # Ensure instance is replaced if user_data changes
  lifecycle {
    create_before_destroy = true
  }
}


