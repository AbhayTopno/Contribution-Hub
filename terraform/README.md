# Contribution Hub - Terraform Infrastructure

This directory contains the Terraform configuration to fully automate the deployment of the Contribution Hub platform on AWS.

## Prerequisites

1. **Terraform**: Installed on your local machine.
2. **AWS CLI**: Installed and configured with your AWS credentials (`aws configure`).

## How to Deploy

### 1. Configure Variables
Copy the example variables file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Open `terraform.tfvars` and add your **GitHub Personal Access Token**. (Note: `.tfvars` files are ignored by git to keep your secrets safe).

### 2. Deploy
Initialize Terraform, review the plan, and apply it:
```bash
terraform init
terraform plan
terraform apply
```

Once `terraform apply` finishes, it will output the public IP of your new EC2 instance and automatically generate your SSH key (`ch-key.pem`) locally. 

> [!IMPORTANT]
> **Initialization Time**: While Terraform finishes quickly, the EC2 instance runs a setup script in the background. It will take **4-6 minutes** for Docker to install, images to build, and the database scripts to finish running. You can check the progress by SSHing into the instance and reviewing `/var/log/cloud-init-output.log`.

---

## Accessing the Server (SSH)

Terraform automatically generates the `ch-key.pem` SSH key for you. If you are using Windows Subsystem for Linux (WSL), you will need to copy the key to your Linux home directory to fix file permission issues before connecting.

Run these commands in your WSL terminal to connect to your instance (replace `<EC2_IP>` with your actual instance IP):

```bash
# 1. Take ownership of your .ssh folder (if it was created as root)
sudo chown -R $USER:$USER ~/.ssh

# 2. Copy the key to your WSL home directory
cp ch-key.pem ~/.ssh/

# 3. Secure the key permissions
chmod 400 ~/.ssh/ch-key.pem

# 4. Connect to your instance!
ssh -i ~/.ssh/ch-key.pem ubuntu@<EC2_IP>
```

---

## Infrastructure Flow & Internal Working

When you run `terraform apply`, the following infrastructure flow occurs:

### 1. AWS Resources Provisioning
- **Key Pair (`tls_private_key`)**: Automatically generates a secure ED25519 key pair, saves the private key locally as `ch-key.pem`, and uploads the public key to AWS.
- **Security Group**: Creates a security group (`ch-tf-sg`) in the default VPC that opens inbound traffic for:
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 3000 (Frontend)
  - Port 8000 (Backend)
- **EC2 Instance**: Provisions an Ubuntu EC2 instance (default `t3.small` with 20GB `gp3` storage) and attaches the security group.

### 2. EC2 Bootstrapping (`setup.sh`)
Terraform uses the `templatefile` function to dynamically inject your `github_token` into `setup.sh` and attaches it to the EC2 instance as a `user_data` script. When the EC2 instance boots for the first time, it runs this script as `root`. 

The script performs the following internal automation:
1. **Installs Dependencies**: Installs Docker and Docker Compose via official Ubuntu apt repositories.
2. **Source Code**: Clones the Contribution Hub repository.
3. **Environment Setup**: Uses AWS IMDSv2 to detect its own public IP and generates the `.env` files for the backend and frontend. It seamlessly injects the dynamic IP into `ALLOWED_HOSTS` and frontend API endpoints, alongside your GitHub token.
4. **Container Launch**: Runs `docker compose up --build -d` to launch the application stack.
5. **Database Seeding**: Runs the Django `migrate` command, followed by `fetch_gsoc_orgs` and `fetch_github_url` to pre-populate the database.

### 3. Local Environment Sync (`local-exec`)
Immediately after the EC2 instance is created, a Terraform `null_resource` triggers a `local-exec` provisioner. 
- This runs Linux `sed` commands locally on your machine.
- It scans your local `backend/.env` and `frontend/.env` files and uses regex to automatically rewrite the configuration with the **newly provisioned EC2 IP**.
- This ensures your local development environment and frontend are instantly synced with your new cloud backend!
