# 🚀 Live Loom Social Media Auto-Reply System

A comprehensive Facebook auto-reply system with real-time GitHub synchronization.

## 🎯 Features

- ✅ **Facebook Webhook Integration** - Automatic comment detection
- ✅ **Auto-Reply System** - Welcome messages to commenters
- ✅ **Supabase Integration** - Database and edge functions
- ✅ **GitHub Auto-Sync** - Real-time file synchronization
- ✅ **Multiple Deployment Options** - Netlify, Vercel, Railway, etc.
- ✅ **MCP Server Integration** - Model Context Protocol support

## 📋 Project Structure

```
live-loom-social-media/
├── netlify/
│   └── functions/
│       └── webhook.js          # Netlify serverless function
├── api/
│   └── webhook.js              # Vercel serverless function
├── webhook-server.js           # Local Express server
├── webhook-handler.js          # Enhanced webhook handler
├── github-sync.js              # GitHub synchronization script
├── mcp.json                    # MCP server configuration
├── netlify.toml                # Netlify configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up GitHub Integration
```bash
# Set your GitHub token
export GITHUB_TOKEN="your_github_token_here"

# Create GitHub repository and start syncing
npm run setup
```

### 3. Start Local Development
```bash
# Start webhook server
npm start

# Or start with auto-reload
npm run dev
```

## 🔧 GitHub Auto-Sync Setup

### Step 1: Get GitHub Token
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy the token

### Step 2: Configure MCP
Update `mcp.json` with your GitHub token:
```json
{
  "mcpServers": {
    "github-sync": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-github",
        "--token",
        "YOUR_ACTUAL_GITHUB_TOKEN"
      ],
      "env": {
        "GITHUB_REPO": "shivomaswal/live-loom-social-media",
        "AUTO_SYNC": "true"
      }
    }
  }
}
```

### Step 3: Start Auto-Sync
```bash
# One-time setup
npm run create-repo

# Start watching for changes
npm run sync:watch
```

## 📡 Webhook Deployment Options

### Option 1: Netlify (Recommended)
```bash
# Deploy to Netlify
# 1. Go to netlify.com
# 2. Connect your GitHub repo
# 3. Deploy automatically
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: Railway
```bash
# Connect GitHub repo to Railway
# Automatic deployment on push
```

## 🔑 Facebook Configuration

### Webhook Settings
- **Webhook URL**: `https://your-deployed-url.com/webhook`
- **Verify Token**: `live_loom_verify_123`
- **Subscribe to**: `feed` events

### Required Permissions
- `pages_manage_metadata`
- `pages_messaging`
- `pages_read_engagement`

## 🎯 Auto-Reply Flow

1. **User comments** on Facebook page post
2. **Webhook receives** comment event
3. **Comment stored** in Supabase database
4. **Welcome message sent** to user's inbox
5. **Status updated** in database

## 📊 Monitoring

### Local Development
```bash
# View webhook logs
npm start

# View GitHub sync logs
npm run sync:watch
```

### Production
- **Netlify**: Dashboard → Functions → webhook
- **Vercel**: Dashboard → Functions
- **Railway**: Dashboard → Logs

## 🔧 Environment Variables

```bash
# GitHub
GITHUB_TOKEN=your_github_token

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
FACEBOOK_PAGE_ID=your_page_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## 📋 Available Scripts

```bash
npm start              # Start webhook server
npm run dev            # Start with auto-reload
npm run sync           # One-time GitHub sync
npm run sync:watch     # Watch for changes and sync
npm run create-repo    # Create GitHub repository
npm run setup          # Full setup (create repo + watch)
```

## 🚀 Deployment URLs

After deployment, your webhook URLs will be:

- **Netlify**: `https://your-site.netlify.app/.netlify/functions/webhook`
- **Vercel**: `https://your-app.vercel.app/api/webhook`
- **Railway**: `https://your-app.railway.app/webhook`

## ✅ Testing

### Test Webhook Verification
```bash
curl "https://your-webhook-url?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123"
# Should return: test123
```

### Test Complete Flow
1. Deploy webhook
2. Configure in Facebook
3. Comment on your page
4. Check logs for comment data
5. Verify auto-reply sent

## 🔍 Troubleshooting

### Common Issues
- **Webhook verification fails**: Check URL and verify token
- **GitHub sync fails**: Verify token permissions
- **Auto-reply not working**: Check Facebook permissions
- **Deployment fails**: Check environment variables

### Debug Commands
```bash
# Test local webhook
curl "http://localhost:3000/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123"

# Check GitHub sync
npm run sync

# View logs
npm start
```

## 📞 Support

For issues or questions:
1. Check the logs
2. Verify configuration
3. Test each component separately
4. Check Facebook App permissions

## 🎉 Success!

Once everything is set up:
- ✅ Files auto-sync to GitHub
- ✅ Webhook receives Facebook events
- ✅ Auto-replies are sent
- ✅ All changes are tracked

Your Live Loom Social Media Auto-Reply System is ready! 🚀