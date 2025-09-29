# Vercel Deployment Troubleshooting Guide

This guide helps resolve common issues when deploying to Vercel.

## Common Issues and Solutions

### 1. "Cannot connect to API server" Error

**Symptoms:**
- Red error message on page load
- Frontend can't communicate with API

**Causes & Solutions:**

#### A. Environment Variables Not Set
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   ```
   OXYLABS_USERNAME = your_actual_username
   OXYLABS_PASSWORD = your_actual_password
   ```
3. Make sure to apply to all environments (Production, Preview, Development)
4. Redeploy the project

#### B. API Routes Not Working
1. Check if `/api/health` endpoint works by visiting: `https://your-app.vercel.app/api/health`
2. Should return JSON with `{"status": "ok", "hasCredentials": true}`
3. If returning HTML, the API routes aren't configured properly

### 2. "Unexpected token 'T', 'The page c'..." Error

**Symptoms:**
- Error when clicking "Fetch Transcript"
- JSON parsing error in console

**Cause:** The frontend is receiving HTML instead of JSON from the API.

**Solutions:**

#### A. Check API Endpoint
1. Test the health endpoint: `https://your-app.vercel.app/api/health`
2. Should return JSON, not HTML

#### B. Verify Environment Variables
1. Visit: `https://your-app.vercel.app/api/debug`
2. Check if `hasOxylabsUsername` and `hasOxylabsPassword` are `true`
3. If `false`, environment variables aren't set correctly

#### C. Re-deploy After Setting Variables
1. After adding environment variables, trigger a new deployment
2. Go to Deployments tab → Click "..." on latest deployment → Redeploy

### 3. Environment Variables Not Working

**Symptoms:**
- API health shows `hasCredentials: false`
- Error about missing credentials

**Solutions:**

#### A. Variable Names
Ensure exact spelling:
- `OXYLABS_USERNAME` (not `OXYLABS_USER` or `USERNAME`)
- `OXYLABS_PASSWORD` (not `OXYLABS_PASS` or `PASSWORD`)

#### B. Variable Values
- No quotes around values in Vercel dashboard
- No extra spaces
- Copy-paste to avoid typos

#### C. Apply to All Environments
- Check "Production", "Preview", and "Development"
- Each must be selected when adding variables

### 4. Function Timeout Issues

**Symptoms:**
- Request takes too long
- 504 Gateway Timeout error

**Solutions:**

#### A. Vercel Limits
- Free plan: 10 second timeout
- Pro plan: 60 second timeout
- Large transcripts may need Pro plan

#### B. Video Selection
- Test with shorter videos first
- Some videos have very long transcripts

### 5. CORS Issues

**Symptoms:**
- Browser console shows CORS errors
- "Access denied" type errors

**Solution:**
- This should be fixed with the latest deployment
- All API endpoints include proper CORS headers

## Testing Steps

### 1. Quick Health Check
Visit: `https://your-app.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "hasCredentials": true,
  "timestamp": "2025-09-30T...",
  "deployment": "vercel"
}
```

### 2. Debug Information
Visit: `https://your-app.vercel.app/api/debug`

Check:
- `hasOxylabsUsername: true`
- `hasOxylabsPassword: true`
- `NODE_ENV: "production"`

### 3. Manual API Test
Use curl or Postman:

```bash
curl -X POST https://your-app.vercel.app/api/transcript \
  -H "Content-Type: application/json" \
  -d '{"videoId": "J1jm4MoZw5Y", "language": "en", "origin": "auto_generated"}'
```

Expected: JSON response with transcript data

### 4. Frontend Test
1. Open: `https://your-app.vercel.app/`
2. Enter video ID: `J1jm4MoZw5Y`
3. Click "Fetch Transcript"
4. Should see transcript results

## Force Redeploy

If issues persist after fixing environment variables:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Find the latest deployment
3. Click "..." → "Redeploy"
4. Or push a small change to GitHub to trigger auto-deploy

## Getting Help

If problems continue:

1. Check Vercel function logs in dashboard
2. Look for error messages in browser console (F12)
3. Test API endpoints individually
4. Verify Oxylabs credentials work outside of Vercel

## Recent Fixes Applied

✅ Added proper Content-Type headers  
✅ Improved error handling for non-JSON responses  
✅ Enhanced CORS configuration  
✅ Added explicit API routing  
✅ Better error messages and debugging  
✅ Added debug endpoint for troubleshooting  

The deployment should work correctly after the latest push to GitHub!