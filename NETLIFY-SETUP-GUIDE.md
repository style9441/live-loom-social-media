# 🚀 Netlify Environment Variables Setup Guide

## 📍 Where to Set Environment Variables in Netlify Dashboard

### Step 1: Access Your Netlify Site Dashboard
1. Go to [netlify.com](https://netlify.com) and log in
2. Click on your site name from the dashboard
3. You'll see your site overview page

### Step 2: Navigate to Site Settings
1. Click on **"Site settings"** in the top navigation bar
2. Look for **"Environment variables"** in the left sidebar
3. Click on **"Environment variables"**

### Step 3: Add Environment Variables
Click the **"Add variable"** button and add these variables one by one:

#### 🔑 Required Environment Variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `SUPABASE_URL` | `https://ouaqeiixottdvyxpuecl.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_key` | Your Supabase service role key (get from Supabase dashboard) |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | `EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD` | Your Facebook page access token |
| `FACEBOOK_PAGE_ID` | `416426288211518` | Your Facebook page ID |

### Step 4: Save and Redeploy
1. After adding all variables, click **"Save"**
2. Go back to your site dashboard
3. Click **"Deploys"** tab
4. Click **"Trigger deploy"** → **"Deploy site"**

## 🎯 Facebook Webhook Configuration

### After Netlify Deployment:
1. Your webhook URL will be: `https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced`
2. Go to Facebook Developer Console
3. Set webhook URL to your Netlify function URL
4. Set verify token to: `live_loom_verify_123`

## 📸 Visual Guide

```
Netlify Dashboard → Your Site → Site Settings → Environment Variables
                                                      ↓
                                              Add Variable Button
                                                      ↓
                                        [Variable Name] [Value] [Save]
```

## ⚠️ Important Notes:
- Replace `your_supabase_service_key` with your actual Supabase service role key
- Make sure to redeploy after adding environment variables
- Environment variables are case-sensitive
- Never commit sensitive keys to your repository

## 🔍 How to Get Supabase Service Role Key:
1. Go to your Supabase project dashboard
2. Click on **"Settings"** → **"API"**
3. Copy the **"service_role"** key (not the anon key)
4. Use this as your `SUPABASE_SERVICE_ROLE_KEY`
