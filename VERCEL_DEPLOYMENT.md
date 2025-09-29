# Vercel Deployment Guide

This guide will help you deploy the YouTube Transcript Fetcher to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Oxylabs Credentials**: Valid Oxylabs username and password

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `vashishthakapoor/youtube-transcript-extractor`
4. Click "Import"

### 2. Configure Environment Variables

Before deploying, add your Oxylabs credentials:

1. In the Vercel project settings, go to "Environment Variables"
2. Add the following variables:

```
OXYLABS_USERNAME=your_oxylabs_username
OXYLABS_PASSWORD=your_oxylabs_password
NODE_ENV=production
```

**Important**: 
- Use your actual Oxylabs credentials
- Mark these as "Secret" for security
- Apply to all environments (Production, Preview, Development)

### 3. Deploy

1. Vercel will automatically detect the `vercel.json` configuration
2. Click "Deploy" 
3. Wait for the build to complete (usually 1-2 minutes)

### 4. Verify Deployment

Once deployed, test your application:

1. **Main App**: `https://your-project.vercel.app/`
2. **API Health**: `https://your-project.vercel.app/api/health`
3. **API Docs**: `https://your-project.vercel.app/docs`

## Project Structure for Vercel

```
├── api/                    # Serverless functions
│   ├── _lib/              # Shared utilities
│   │   └── YouTubeTranscriptFetcher.js
│   ├── health.js          # GET /api/health
│   └── transcript.js      # POST /api/transcript
├── public/                # Static files
│   ├── index.html         # Main web interface
│   └── api-docs.html      # API documentation
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## API Endpoints

- `GET /api/health` - Check API status
- `POST /api/transcript` - Fetch YouTube transcript

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OXYLABS_USERNAME` | Your Oxylabs username | Yes |
| `OXYLABS_PASSWORD` | Your Oxylabs password | Yes |
| `NODE_ENV` | Environment (production) | No |

## Troubleshooting

### Common Issues

1. **"Oxylabs credentials not configured"**
   - Ensure environment variables are set correctly
   - Check variable names for typos
   - Verify they're applied to the correct environment

2. **"Function timeout"**
   - Vercel functions have a 10s timeout on free plan
   - Large transcripts may take longer to fetch
   - Consider upgrading to Pro plan for 60s timeout

3. **"Invalid video ID"**
   - Ensure the video ID is exactly 11 characters
   - Check that the YouTube video exists and has transcripts

### Debug Steps

1. Check the Vercel function logs in your dashboard
2. Test the API health endpoint: `/api/health`
3. Verify environment variables are set
4. Test with a known working video ID

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. Push changes to GitHub
2. Vercel detects the changes
3. Automatic build and deployment
4. Live site updates in ~2 minutes

## Performance Tips

1. **Caching**: API responses are automatically cached by Vercel
2. **Edge Network**: Vercel uses a global CDN for fast loading
3. **Serverless**: Functions scale automatically based on demand

## Security Notes

- Environment variables are encrypted at rest
- API credentials are not exposed to the frontend
- HTTPS is enforced by default
- CORS headers are properly configured

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review function logs in Vercel dashboard
3. Test API endpoints directly
4. Verify Oxylabs credentials are working

---

**Note**: This deployment uses Vercel's serverless functions, which is different from the traditional Express.js server. The functionality remains the same, but the architecture is optimized for serverless deployment.