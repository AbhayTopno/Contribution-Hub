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
   cd contribution-hub
   ```

2. **Environment Configuration**

   **Backend Setup:**

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` with your values:

   - `GITHUB_TOKEN`: GitHub personal access token
   - `GOOGLE_CSE_API_KEY`: Google Custom Search Engine API key
   - `GOOGLE_CSE_ID`: Google Custom Search Engine ID

   **Frontend Setup:**

   ```bash
   cd frontend
   cp .env.example .env
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
   docker exec -it backend python manage.py fetch_github_url --limit 105
   ```

   **Note:** The Google Custom Search Engine API has a daily limit of 100-105 requests. You may need to create additional API keys and CSE IDs to scrape remaining GitHub URLs if you exceed this limit.

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## API Keys Setup

### GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with repository access permissions
3. Add to your `.env` file

### Google Custom Search Engine

1. Visit [Google Custom Search Engine](https://cse.google.com/)
2. Create a new search engine
3. Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
4. Add both API key and CSE ID to your `.env` file

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
