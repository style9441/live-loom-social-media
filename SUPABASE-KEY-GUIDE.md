# 🔑 How to Get Supabase Service Role Key

## 📍 Step-by-Step Guide

### Step 1: Go to Your Supabase Project
1. Open your browser and go to [supabase.com](https://supabase.com)
2. Log in to your account
3. Click on your **"Live Loom Social media"** project

### Step 2: Navigate to API Settings
1. In your project dashboard, look for **"Settings"** in the left sidebar
2. Click on **"Settings"**
3. Click on **"API"** from the settings menu

### Step 3: Find Your Service Role Key
1. You'll see a section called **"Project API keys"**
2. Look for **"service_role"** key (NOT the "anon" key)
3. Click the **"Copy"** button next to the service_role key

### Step 4: Use the Key
1. Copy the entire service_role key
2. Replace `your_supabase_service_key` in your environment variables with this key

## 🎯 Visual Guide

```
Supabase Dashboard
    ↓
Your Project (Live Loom Social media)
    ↓
Settings (left sidebar)
    ↓
API
    ↓
Project API keys section
    ↓
service_role key → Copy button
```

## ⚠️ Important Notes:

### ✅ **Use the service_role key because:**
- It has full access to your database
- It can bypass Row Level Security (RLS)
- It's needed for server-side operations
- It's safe to use in serverless functions

### ❌ **Don't use the anon key because:**
- It's for client-side applications
- It respects Row Level Security
- It has limited permissions
- It won't work for your webhook functions

## 🔒 Security Tips:
- **Never commit** the service_role key to your repository
- **Only use it** in serverless functions (like Netlify Functions)
- **Keep it secret** - treat it like a password
- **Use environment variables** to store it securely

## 📋 Your Key Format:
Your service_role key will look something like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91YXFlaWl4b3R0ZHZ5eHB1ZWNsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NjQ4NzIwMCwiZXhwIjoyMDEyMDYzMjAwfQ.example_signature_here
```

## 🚀 After Getting Your Key:
1. Copy the service_role key
2. Go to Netlify dashboard → Site Settings → Environment Variables
3. Add variable: `SUPABASE_SERVICE_ROLE_KEY`
4. Paste your service_role key as the value
5. Save and redeploy your site
