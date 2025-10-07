# 🚀 Live Loom Social Media - Private Reply System Deployment Guide

## 📋 Complete Setup Checklist

### ✅ **1. Database Setup (Supabase)**
- [x] `test_comments` table created
- [x] `interaction_logs` table created  
- [x] `reply_templates` table created
- [x] `facebook_pages` table created

### ✅ **2. Facebook App Configuration**
- [x] Facebook App created
- [x] Page Access Token obtained: `EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD`
- [x] Page ID: `416426288211518`
- [x] Required permissions: `pages_manage_metadata`, `pages_messaging`, `pages_read_engagement`

### ✅ **3. GitHub Integration**
- [x] Repository: `https://github.com/style9441/live-loom-social-media`
- [x] Auto-sync configured
- [x] MCP server integration

## 🚀 **Deployment Options**

### **Option 1: Netlify (Recommended)**

#### **Step 1: Deploy to Netlify**
1. **Go to [netlify.com](https://netlify.com)**
2. **Connect your GitHub repository**
3. **Deploy settings:**
   - Build command: `echo 'No build step required'`
   - Publish directory: `.`
   - Functions directory: `netlify/functions`

#### **Step 2: Configure Environment Variables**
In Netlify dashboard → Site settings → Environment variables:
```
SUPABASE_URL=https://ouaqeiixottdvyxpuecl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
FACEBOOK_PAGE_ACCESS_TOKEN=EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD
FACEBOOK_PAGE_ID=416426288211518
```

#### **Step 3: Configure Facebook Webhook**
- **Webhook URL**: `https://your-site.netlify.app/.netlify/functions/facebook-webhook-enhanced`
- **Verify Token**: `live_loom_verify_123`
- **Subscribe to**: `feed` events

### **Option 2: Vercel**

#### **Step 1: Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

#### **Step 2: Configure Environment Variables**
In Vercel dashboard → Project settings → Environment variables:
```
SUPABASE_URL=https://ouaqeiixottdvyxpuecl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
FACEBOOK_PAGE_ACCESS_TOKEN=EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD
FACEBOOK_PAGE_ID=416426288211518
```

#### **Step 3: Configure Facebook Webhook**
- **Webhook URL**: `https://your-app.vercel.app/api/facebook-webhook-enhanced`
- **Verify Token**: `live_loom_verify_123`
- **Subscribe to**: `feed` events

### **Option 3: Railway**

#### **Step 1: Deploy to Railway**
1. **Connect GitHub repository to Railway**
2. **Deploy automatically**

#### **Step 2: Configure Environment Variables**
In Railway dashboard → Variables:
```
SUPABASE_URL=https://ouaqeiixottdvyxpuecl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
FACEBOOK_PAGE_ACCESS_TOKEN=EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD
FACEBOOK_PAGE_ID=416426288211518
```

## 🧪 **Testing the System**

### **Step 1: Test Webhook Verification**
```bash
curl "https://your-webhook-url?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123"
# Should return: test123
```

### **Step 2: Test Complete Flow**
1. **Comment on your Facebook page post**
2. **Check webhook logs** in your deployment platform
3. **Verify comment stored** in Supabase database
4. **Check private message** sent to commenter
5. **Review interaction logs** in database

### **Step 3: Monitor System**
- **Webhook logs**: Check deployment platform logs
- **Database**: Monitor `test_comments` and `interaction_logs` tables
- **Facebook**: Check message delivery in Facebook Page inbox

## 📊 **System Features**

### **✅ Private Reply System**
- **Automatic Detection**: Comments trigger webhook
- **Database Storage**: All comments stored in Supabase
- **Template System**: Multiple reply templates with personalization
- **Smart Replies**: Context-aware message selection
- **Duplicate Prevention**: Won't reply to same comment twice

### **✅ Template Management**
- **6 Default Templates**: Welcome, Product, Support messages
- **Personalization**: Uses `{{name}}` for commenter name
- **Smart Selection**: Chooses template based on comment content
- **Admin Dashboard**: Manage templates via web interface

### **✅ Analytics & Logging**
- **Interaction Logs**: All replies tracked in database
- **Response Rate**: Monitor system performance
- **Comment History**: View all processed comments
- **Error Tracking**: Failed attempts logged

### **✅ Admin Dashboard**
- **Real-time Stats**: Comments, replies, response rate
- **Template Management**: Add, edit, enable/disable templates
- **Recent Comments**: View latest interactions
- **System Status**: Monitor webhook and database health

## 🔧 **Configuration Files**

### **Webhook Functions**
- `netlify/functions/facebook-webhook-enhanced.js` - Complete system
- `api/facebook-webhook-enhanced.js` - Vercel version
- `webhook-server.js` - Local development

### **Templates**
- `templates/reply-templates.json` - Template definitions
- Built-in templates in webhook functions

### **Database Schema**
```sql
-- Comments table
CREATE TABLE test_comments (
  id SERIAL PRIMARY KEY,
  comment_id VARCHAR(255) UNIQUE,
  commenter_id VARCHAR(255),
  comment_text TEXT,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interaction logs
CREATE TABLE interaction_logs (
  id SERIAL PRIMARY KEY,
  comment_id VARCHAR(255) NOT NULL,
  commenter_id VARCHAR(255),
  commenter_name VARCHAR(255),
  comment_text TEXT,
  reply_message TEXT,
  api_response JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 **Expected Results**

### **When Someone Comments:**
1. ✅ **Webhook receives** comment event
2. ✅ **Comment stored** in database
3. ✅ **Template selected** based on content
4. ✅ **Personalized message** sent to commenter's inbox
5. ✅ **Interaction logged** for analytics
6. ✅ **Status updated** to prevent duplicates

### **Message Examples:**
- **General Comment**: "Hi John! 👋 Thanks for your comment! We're excited to connect with you."
- **Product Inquiry**: "Hi Jane! 🛍️ Thanks for your interest! We'd love to tell you more about our products."
- **Support Request**: "Hello Mike! 🆘 We're here to help! If you need any support, just send us a message."

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Webhook verification fails**: Check URL and verify token
2. **Messages not sending**: Verify Facebook permissions and token
3. **Database errors**: Check Supabase connection and keys
4. **Duplicate replies**: System prevents this automatically

### **Debug Commands:**
```bash
# Test webhook
curl "https://your-webhook-url?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123"

# Check database
# Use Supabase dashboard to view tables

# Monitor logs
# Check deployment platform logs for errors
```

## 🎉 **Success!**

Your Live Loom Social Media Private Reply System is now complete and ready to:

- ✅ **Automatically reply** to Facebook page comments
- ✅ **Send personalized messages** to commenters' inboxes
- ✅ **Track all interactions** for analytics
- ✅ **Manage templates** via admin dashboard
- ✅ **Scale automatically** with your page growth

**Deploy to your chosen platform and start engaging with your audience!** 🚀
