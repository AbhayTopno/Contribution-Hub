output "instance_id" {
  description = "The ID of the EC2 instance"
  value       = aws_instance.my_instance.id
}

output "instance_public_ip" {
  description = "The public IP address of the EC2 instance"
  value       = aws_instance.my_instance.public_ip
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.my_security_group.id
}

output "key_pair_name" {
  description = "The name of the key pair"
  value       = aws_key_pair.my_key.key_name
}
