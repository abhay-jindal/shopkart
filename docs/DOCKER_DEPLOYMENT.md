# Docker Deployment with GitHub Actions

This document explains the Docker deployment workflow using GitHub Actions with Docker Hub registry and proper versioning and tagging.

## Overview

The GitHub Actions workflow automatically builds and pushes Docker images to Docker Hub whenever code is pushed to specific branches or when tags are created.

## Workflow Features

### 🚀 **Automatic Triggers**
- **Main branch**: Builds and pushes with `latest` tag
- **Develop branch**: Builds and pushes with `dev` tag
- **Tags (v*)**: Builds and pushes with version-specific tags
- **Pull Requests**: Builds for testing (no push)

### 🏷️ **Versioning Strategy**

| Branch/Tag | Version Format | Tags Created |
|------------|----------------|--------------|
| `main` | `{commit-hash}` | `latest`, `{commit-hash}` |
| `develop` | `dev-{commit-hash}` | `dev`, `dev-{commit-hash}` |
| `v1.2.3` | `1.2.3` | `v1.2.3`, `1.2.3`, `1.2`, `1` |
| `feature/xyz` | `feature-xyz-{commit-hash}` | `pr`, `feature-xyz-{commit-hash}` |

### 🐳 **Docker Images**

The workflow builds three types of images:

1. **Backend Image**: `docker.io/{username}/shopkart_backend`
2. **Frontend Image**: `docker.io/{username}/shopkart_frontend`
3. **Combined Image**: `docker.io/{username}/shopkart_app` (main branch and tags only)

## File Structure

```
├── .github/
│   └── workflows/
│       └── docker-build-push.yml    # Main workflow
├── backend/
│   ├── Dockerfile                   # Backend Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile                   # Frontend Dockerfile
│   ├── nginx.conf                   # Nginx configuration
│   └── package.json
├── Dockerfile                       # Combined application Dockerfile
└── docs/
    └── DOCKER_DEPLOYMENT.md        # This documentation
```

## Setup Instructions

### 1. Create Docker Hub Account & Repository

1. **Go to [Docker Hub](https://hub.docker.com/)**
2. **Create an account if you don't have one**
3. **Create repositories for your project:**
   - `shopkart_backend`
   - `shopkart_frontend`
   - `shopkart_app` (optional)

### 2. Create Docker Hub Access Token

1. **Log into Docker Hub**
2. **Go to Account Settings → Security**
3. **Click "New Access Token"**
4. **Give it a name like "GitHub Actions"**
5. **Copy the token (you'll need it for the next step)**

### 3. Add Docker Hub Secrets to GitHub

1. **Go to your GitHub repository**
2. **Click "Settings" → "Secrets and variables" → "Actions"**
3. **Click "New repository secret"**
4. **Add these secrets:**

```
DOCKER_USERNAME = your-dockerhub-username
DOCKER_PASSWORD = your-dockerhub-access-token
```

### 4. Enable GitHub Actions

1. Go to your repository settings
2. Navigate to "Actions" → "General"
3. Enable "Allow all actions and reusable workflows"

### 5. Create a Release Tag

To trigger a versioned release:

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0
```

## Usage Examples

### Pull Latest Images

```bash
# Pull latest backend
docker pull yourusername/shopkart_backend:latest

# Pull latest frontend
docker pull yourusername/shopkart_frontend:latest

# Pull specific version
docker pull yourusername/shopkart_backend:v1.0.0
docker pull yourusername/shopkart_frontend:v1.0.0
```

### Run Individual Services

```bash
# Run backend
docker run -p 8000:8000 yourusername/shopkart_backend:latest

# Run frontend
docker run -p 80:80 yourusername/shopkart_frontend:latest
```

### Run Combined Application

```bash
# Run the complete application
docker run -p 80:80 -p 8000:8000 yourusername/shopkart_app:latest
```

## Docker Compose Example

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  backend:
    image: yourusername/shopkart_backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/shopkart
    depends_on:
      - db

  frontend:
    image: yourusername/shopkart_frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=shopkart
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Workflow Jobs

### 1. Version Job
- Determines version and tag based on branch/tag
- Provides outputs for other jobs

### 2. Build Backend Job
- Builds Python backend image
- Supports multi-platform builds (amd64, arm64)
- Uses GitHub Actions cache for faster builds

### 3. Build Frontend Job
- Builds React frontend image
- Uses nginx for serving static files
- Includes security headers and optimization

### 4. Build Combined Job (Optional)
- Builds complete application image
- Only runs on main branch and tags
- Includes both frontend and backend

### 5. Create Release Job
- Automatically creates GitHub releases
- Includes Docker image information
- Only runs on tag pushes

### 6. Notify Job
- Provides build status notifications
- Runs on both success and failure

## Security Features

### Docker Images
- Non-root user execution
- Multi-stage builds for smaller images
- Security headers in nginx
- Health checks for monitoring

### GitHub Actions
- Uses official actions with pinned versions
- Minimal permissions required
- Secure token handling

## Monitoring and Debugging

### Check Build Status
1. Go to your repository
2. Click "Actions" tab
3. View workflow runs and logs

### Health Checks
```bash
# Backend health check
curl http://localhost:8000/health

# Frontend health check
curl http://localhost:80/health
```

### View Logs
```bash
# Backend logs
docker logs <backend-container-id>

# Frontend logs
docker logs <frontend-container-id>
```

## Troubleshooting

### Common Issues

1. **Build fails on dependency installation**
   - Check `requirements.txt` and `package.json`
   - Ensure all dependencies are properly specified

2. **Image push fails**
   - Verify Docker Hub credentials in GitHub secrets
   - Check if Docker Hub repositories exist
   - Ensure the access token has proper permissions

3. **Health checks fail**
   - Ensure applications are listening on correct ports
   - Check if health endpoints are implemented

### Debug Commands

```bash
# Test local build
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend

# Run with debug output
docker run -it --rm test-backend python -u main.py
```

## Best Practices

### Versioning
- Use semantic versioning (v1.2.3)
- Tag releases after testing
- Keep develop branch for ongoing development

### Security
- Regularly update base images
- Scan images for vulnerabilities
- Use specific version tags in production
- Use Docker Hub access tokens instead of passwords

### Performance
- Use multi-stage builds
- Leverage Docker layer caching
- Optimize image sizes

## Advanced Configuration

### Custom Registry
To use a different registry, modify the workflow:

```yaml
env:
  REGISTRY: your-registry.com
  IMAGE_NAME: your-org/your-repo
```

### Additional Platforms
Add more platforms to the build:

```yaml
platforms: linux/amd64,linux/arm64,linux/arm/v7
```

### Custom Tags
Modify the metadata action for custom tagging:

```yaml
tags: |
  type=ref,event=branch
  type=raw,value=custom-tag
```

## Support

For issues or questions:
1. Check the GitHub Actions logs
2. Review this documentation
3. Create an issue in the repository

---

**Note**: This workflow is configured for Docker Hub. Make sure you have the correct Docker Hub credentials in your GitHub repository secrets. 