# Contribution-Hub

# Project Setup Guide

This project consists of a backend and frontend application with specific environment configurations.

## Environment Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create your environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your actual values:

   ```bash
   nano .env
   # or use your preferred editor
   ```

4. Configure the following variables:
   - `DB_PASSWORD`: Set your PostgreSQL password
   - `SECRET_KEY`: Generate a new Django secret key
   - `GITHUB_TOKEN`: Add your GitHub personal access token
   - `GOOGLE_CSE_API_KEY`: Add your Google Custom Search Engine API key
   - `GOOGLE_CSE_ID`: Add your Google Custom Search Engine ID

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Create your environment file from the example:

   ```bash
   cp .env.example .env
   ```

3. The default values should work for local development, but you can modify them if needed:
   ```bash
   nano .env
   # or use your preferred editor
   ```

## Quick Setup Commands

If you prefer to use the example files directly (for development purposes):

```bash
# Backend
cd backend
cat .env.example > .env

# Frontend
cd frontend
cat .env.example > .env
```

## Important Notes

- **Never commit your actual `.env` files** to version control
- The `.env.example` files are templates and should be committed to the repository
- Make sure to update your actual environment variables with real values before running the application
- For production deployments, use secure methods to manage environment variables

## Security Considerations

- Generate a new `SECRET_KEY` for Django in production
- Use strong database passwords
- Keep your API keys secure and rotate them regularly
- Consider using environment-specific configuration for different deployment stages

## Getting API Keys

### GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with appropriate permissions
3. Copy the token and add it to your `.env` file

### Google Custom Search Engine

1. Visit the [Google Custom Search Engine](https://cse.google.com/) page
2. Create a new search engine or use an existing one
3. Get your API key from the [Google Cloud Console](https://console.cloud.google.com/)
4. Add both the API key and CSE ID to your `.env` file

## Next Steps

After setting up your environment files:

1. Install dependencies for both backend and frontend
2. Set up your database
3. Run migrations (if applicable)
4. Start your development servers

Make sure both applications can communicate with each other using the configured endpoints.
