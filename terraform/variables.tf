variable "aws_region" {
  description = "AWS region to deploy the resources"
  type        = string
  default     = "ap-south-1"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
  default     = "ch-key"
}

variable "public_key_path" {
  description = "Path to the public key file"
  type        = string
  default     = "ch-key.pub"
}

variable "sg_name" {
  description = "Name of the security group"
  type        = string
  default     = "ch-tf-sg"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-01a00762f46d584a1"
}

variable "volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 20
}

variable "volume_type" {
  description = "Type of the root volume"
  type        = string
  default     = "gp3"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "TF-CH-EC2"
}

variable "github_token" {
  description = "GitHub Personal Access Token for the backend"
  type        = string
  sensitive   = true
}
