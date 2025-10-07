# 🔧 Facebook Webhook Troubleshooting Guide

## 🚨 "Nothing happens when I comment" - Debug Steps

### Step 1: Check Your Netlify Function URL
1. Go to your Netlify dashboard
2. Find your site URL (e.g., `https://your-site-name.netlify.app`)
3. Your webhook URL should be: `https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced`

### Step 2: Test Your Webhook Endpoint
Open this URL in your browser:
```
https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123
```

**Expected Response:** `test123`

### Step 3: Check Facebook Webhook Configuration
1. Go to Facebook Developer Console
2. Select your app
3. Go to **Webhooks** section
4. Verify these settings:
   - **Callback URL:** `https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced`
   - **Verify Token:** `live_loom_verify_123`
   - **Subscriptions:** Check `feed` subscription

### Step 4: Check Netlify Function Logs
1. Go to Netlify dashboard
2. Click **Functions** tab
3. Click on your function
4. Check **Logs** for any errors

### Step 5: Verify Environment Variables
In Netlify dashboard → Site Settings → Environment Variables, make sure you have:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (with actual key, not placeholder)
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `FACEBOOK_PAGE_ID`

### Step 6: Test Facebook Page Permissions
1. Go to Facebook Developer Console
2. Check **App Review** → **Permissions and Features**
3. Make sure you have:
   - `pages_manage_metadata`
   - `pages_messaging`
   - `pages_read_engagement`

## 🔍 Common Issues & Solutions

### Issue 1: Webhook Not Verified
**Error:** "The callback URL or verify token couldn't be validated"
**Solution:** 
- Check your Netlify function URL is correct
- Verify the verify token matches exactly
- Make sure your function is deployed

### Issue 2: No Events Received
**Problem:** Webhook verified but no events
**Solution:**
- Check Facebook page subscriptions
- Make sure you're commenting on the correct page
- Verify page access token is valid

### Issue 3: Function Errors
**Problem:** Function deployed but errors in logs
**Solution:**
- Check environment variables are set correctly
- Verify Supabase service role key is valid
- Check function logs for specific errors

### Issue 4: Wrong Page ID
**Problem:** Comments not triggering webhook
**Solution:**
- Double-check your Facebook Page ID
- Make sure you're commenting on the right page
- Verify page access token matches the page

## 🧪 Quick Tests

### Test 1: Manual Webhook Test
```bash
curl -X GET "https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123"
```

### Test 2: Check Function Status
Visit: `https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced`

### Test 3: Facebook Webhook Test
1. Go to Facebook Developer Console
2. Webhooks → Test → Send test event
3. Check if your function receives it

## 📋 Debug Checklist

- [ ] Netlify function deployed successfully
- [ ] Webhook URL is correct and accessible
- [ ] Facebook webhook verified successfully
- [ ] Environment variables set correctly
- [ ] Facebook page subscriptions enabled
- [ ] Page access token is valid
- [ ] Supabase service role key is correct
- [ ] Commenting on the correct Facebook page
- [ ] Function logs show no errors

## 🆘 Still Not Working?

If nothing works, try this simple test:
1. Create a basic webhook function
2. Test it with Facebook
3. Gradually add features back

Let me know what you find in the logs!
