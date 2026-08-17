# Contribution Hub

**Contribution Hub** is a platform designed to help developers discover open source projects that match their field of interest and tech stack. Whether you're a beginner looking for your first contribution or an experienced developer seeking new challenges, Contribution Hub connects you with projects that align with your skills and interests.

## Features

- 🔍 **Smart Project Discovery**: Find projects based on your preferred technologies and interests
- 📊 **Tech Stack Matching**: Get recommendations tailored to your skill set
- 🎯 **Interest-Based Filtering**: Discover projects in domains you're passionate about
- 🚀 **Beginner-Friendly**: Easy-to-use interface for developers of all levels

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Docker running in the background

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbhayTopno/Contribution-Hub.git
   cd Contribution-hub
   ```

2. **Environment Configuration**

   **Backend Setup:**

   ```bash
   touch backend/.env
   cat backend/.env.example > backend/.env
   ```

   Edit `.env` with your values:

   - `GITHUB_TOKEN`: GitHub personal access token

   **Frontend Setup:**

   ```bash
   touch frontend/.env
   cat frontend/.env.example > frontend/.env
   ```

3. **Start the Application**

   ```bash
   docker compose up --build -d
   ```

   ✅ Ensure all services show "Healthy" status (backend, frontend, container_backend, container_frontend, container_db).

4. **Database Setup**

   ```bash
   # Run database migrations
   docker exec -it backend python manage.py migrate

   # Fetch GSoC organizations data
   docker exec -it backend python manage.py fetch_gsoc_orgs

   # Fetch GitHub URLs
   docker exec -it backend python manage.py fetch_github_url --limit 600
   ```

   **Note:** GitHub Search allows 30 authenticated requests per minute. The command processes one organization every two seconds and waits for the API reset time if the token reaches its rate limit.

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## API Keys Setup

### GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a fine-grained token with public read access
3. Add to your `.env` file

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords and rotate API keys regularly
- Generate a new `SECRET_KEY` for production environments

## Contributing

We welcome contributions! Please feel free to submit issues and enhancement requests.

## Support

If you encounter any issues during setup, please check that:

- Docker is running properly
- All environment variables are correctly set
- Required API keys have appropriate permissions
