# 🚀 Facebook Webhook - Netlify Deployment

## 📋 Files Created

- `netlify/functions/webhook.js` - Main webhook function
- `index.html` - Landing page with webhook info
- `netlify.toml` - Netlify configuration
- `package.json` - Dependencies

## 🎯 Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Connect your GitHub repository**
5. **Deploy settings:**
   - Build command: `echo 'No build step required'`
   - Publish directory: `.`
6. **Click "Deploy site"**

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## 🔧 Webhook Configuration

After deployment, you'll get a URL like:
`https://your-site-name.netlify.app`

**Your webhook URL will be:**
`https://your-site-name.netlify.app/.netlify/functions/webhook`

**Or the shorter version:**
`https://your-site-name.netlify.app/webhook`

## 📋 Facebook App Settings

- **Webhook URL**: `https://your-site-name.netlify.app/.netlify/functions/webhook`
- **Verify Token**: `live_loom_verify_123`

## ✅ Testing

1. **Visit your deployed site**
2. **Click "Test Webhook Verification"**
3. **Should return "test123"**
4. **Configure in Facebook**
5. **Test with a comment**

## 🔍 Monitoring

- **View logs**: Netlify Dashboard → Functions → webhook
- **Real-time logs**: `netlify functions:serve` (local development)

## 🎯 Expected Results

- ✅ Webhook verification works
- ✅ Comment events are logged
- ✅ Ready for auto-reply integration
