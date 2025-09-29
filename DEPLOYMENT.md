# Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Oxylabs account with API credentials
- Git installed

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vashishthakapoor/youtube-transcript-extractor.git
   cd youtube-transcript-extractor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Oxylabs credentials:
   # OXYLABS_USERNAME=your_username
   # OXYLABS_PASSWORD=your_password
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Access the web interface:**
   - Open `http://localhost:3000` in your browser
   - API docs available at `http://localhost:3000/docs`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and configure:**
   ```bash
   git clone https://github.com/vashishthakapoor/youtube-transcript-extractor.git
   cd youtube-transcript-extractor
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Deploy:**
   ```bash
   docker-compose up -d
   ```

3. **Access:**
   - Application: `http://localhost:3000`
   - Check logs: `docker-compose logs -f`
   - Stop: `docker-compose down`

### Using Docker directly

```bash
# Build image
docker build -t youtube-transcript .

# Run container
docker run -d \
  --name youtube-transcript \
  -p 3000:3000 \
  --env-file .env \
  youtube-transcript
```

## ☁️ Cloud Deployment

### Heroku Deployment

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set OXYLABS_USERNAME=your_username
   heroku config:set OXYLABS_PASSWORD=your_password
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Railway Deployment

1. **Connect your GitHub repo to Railway**
2. **Set environment variables in Railway dashboard:**
   - `OXYLABS_USERNAME`
   - `OXYLABS_PASSWORD` 
3. **Deploy automatically on push**

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

### DigitalOcean App Platform

1. **Create new app from GitHub repo**
2. **Configure build settings:**
   - Build command: `npm install`
   - Run command: `npm start`
3. **Set environment variables**
4. **Deploy**

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OXYLABS_USERNAME` | Yes | Your Oxylabs API username |
| `OXYLABS_PASSWORD` | Yes | Your Oxylabs API password |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |

## 🔍 Health Check

The application includes a health check endpoint:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "hasCredentials": true,
  "timestamp": "2025-09-26T..."
}
```

## 📊 Monitoring

### Basic Monitoring

1. **Check application status:**
   ```bash
   curl -f http://localhost:3000/api/health || echo "App is down"
   ```

2. **Check logs:**
   ```bash
   # Docker Compose
   docker-compose logs -f
   
   # Docker
   docker logs youtube-transcript
   
   # PM2 (if using)
   pm2 logs
   ```

### Production Monitoring

Consider using:
- **Uptime monitoring**: Pingdom, UptimeRobot
- **Log aggregation**: Loggly, Papertrail
- **Performance monitoring**: New Relic, DataDog
- **Error tracking**: Sentry

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secure credential storage in production
   - Rotate API keys regularly

2. **Network Security:**
   - Use HTTPS in production
   - Implement rate limiting
   - Add CORS configuration for specific domains

3. **Container Security:**
   - Use non-root user (already implemented)
   - Scan images for vulnerabilities
   - Keep base images updated

## 🚨 Troubleshooting

### Common Issues

1. **"Oxylabs credentials not configured"**
   - Check .env file exists and has correct credentials
   - Verify environment variables are loaded

2. **"Cannot connect to API server"**
   - Check if server is running on correct port
   - Verify firewall settings
   - Check Docker container logs

3. **"API Error: 401"**
   - Verify Oxylabs credentials are correct
   - Check if API key has required permissions

4. **"No transcript available"**
   - Try different language codes
   - Switch between uploader_provided and auto_generated
   - Verify video exists and has transcripts

### Debug Mode

Enable debug logging:
```bash
DEBUG=1 npm start
```

## 📈 Scaling

### Horizontal Scaling

For high traffic, consider:

1. **Load Balancer:**
   ```yaml
   # docker-compose.yml
   services:
     app1:
       build: .
       environment:
         - PORT=3001
     app2:
       build: .
       environment:
         - PORT=3002
     nginx:
       image: nginx
       # Configure load balancing
   ```

2. **Container Orchestration:**
   - Kubernetes
   - Docker Swarm
   - Nomad

### Performance Optimization

1. **Caching:**
   - Implement Redis for transcript caching
   - Add CDN for static assets

2. **Rate Limiting:**
   - Implement per-IP rate limiting
   - Add queue system for high volume

## 🔄 Updates

### Updating the Application

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Update dependencies:**
   ```bash
   npm install
   ```

3. **Restart application:**
   ```bash
   # Docker Compose
   docker-compose down && docker-compose up -d
   
   # PM2
   pm2 restart all
   
   # Systemd
   sudo systemctl restart youtube-transcript
   ```

### Database Migrations

Currently, no database is required. Future versions may include:
- Transcript caching
- User management
- Analytics storage

## 📞 Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/vashishthakapoor/youtube-transcript-extractor/issues)
2. Review application logs
3. Verify Oxylabs API status
4. Create a new issue with deployment details