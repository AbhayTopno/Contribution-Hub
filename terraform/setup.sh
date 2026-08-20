#!/bin/bash
# Install Docker
apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Clone the repo
git clone https://github.com/AbhayTopno/Contribution-Hub.git /home/ubuntu/Contribution-Hub
cd /home/ubuntu/Contribution-Hub

# Fetch IP using IMDSv2
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
EC2_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Setup backend .env
cat backend/.env.example > backend/.env
sed -i "s|your_github_token_here|${github_token}|g" backend/.env
sed -i "s|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=http://$EC2_IP:3000,http://localhost:3000,http://frontend:3000|g" backend/.env
echo "" >> backend/.env
echo "ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend,$EC2_IP" >> backend/.env

# Setup frontend .env
cat frontend/.env.example > frontend/.env
sed -i "s|localhost|$EC2_IP|g" frontend/.env
sed -i "s|127.0.0.1|$EC2_IP|g" frontend/.env

# Start application
docker compose up --build -d

# Wait for containers to start
sleep 30

# Run commands
docker exec backend python manage.py migrate
docker exec backend python manage.py fetch_gsoc_orgs
docker exec backend python manage.py fetch_github_url --limit 600

# Fix permissions for ubuntu user
chown -R ubuntu:ubuntu /home/ubuntu/Contribution-Hub
