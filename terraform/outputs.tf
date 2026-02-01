output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "frontend_url" {
  description = "URL to access the frontend application"
  value       = "http://${aws_instance.app_server.public_ip}"
}

output "backend_url" {
  description = "URL to access the backend API"
  value       = "http://${aws_instance.app_server.public_ip}:8001"
}

output "backend_docs_url" {
  description = "URL to access the backend API documentation"
  value       = "http://${aws_instance.app_server.public_ip}:8001/docs"
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ${var.key_pair_name}.pem ec2-user@${aws_instance.app_server.public_ip}"
}

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.app_server.id
}
