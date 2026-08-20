resource "tls_private_key" "my_key" {
  algorithm = "ED25519"
}

resource "aws_key_pair" "my_key" {
  key_name   = var.key_name
  public_key = tls_private_key.my_key.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.my_key.private_key_openssh
  filename = "${path.module}/${var.key_name}.pem"
}

resource "aws_default_vpc" "default" {}

resource "aws_security_group" "my_security_group" {
  name        = var.sg_name
  description = "This will add a TF generated Security Group"
  vpc_id      = aws_default_vpc.default.id

  ingress {
    description = "SSH Open"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP Open"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend Open"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend Open"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "All access open outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.sg_name
  }
}

resource "aws_instance" "my_instance" {
  ami             = var.ami_id
  instance_type   = var.instance_type
  key_name        = aws_key_pair.my_key.key_name
  security_groups = [aws_security_group.my_security_group.name]

  root_block_device {
    volume_size = var.volume_size
    volume_type = var.volume_type
  }

  user_data = templatefile("setup.sh", {
    github_token = var.github_token
  })

  tags = {
    Name = var.instance_name
  }
}

resource "null_resource" "update_local_envs" {
  triggers = {
    instance_ip = aws_instance.my_instance.public_ip
  }

  provisioner "local-exec" {
    command = "sed -i -E 's|^ALLOWED_HOSTS=.*|ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend,${aws_instance.my_instance.public_ip}|' ../backend/.env"
  }

  provisioner "local-exec" {
    command = "sed -i -E 's|^ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=http://${aws_instance.my_instance.public_ip}:3000,http://localhost:3000,http://frontend:3000|' ../backend/.env"
  }
  
  provisioner "local-exec" {
    command = "sed -i -E 's|=.*:8000|=http://${aws_instance.my_instance.public_ip}:8000|g' ../frontend/.env"
  }
}