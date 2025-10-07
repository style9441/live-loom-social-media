// Script to help set up Netlify environment variables
// Run this script to get formatted environment variables for Netlify

const envVars = {
  SUPABASE_URL: 'https://ouaqeiixottdvyxpuecl.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'your_supabase_service_key', // Replace with actual key
  FACEBOOK_PAGE_ACCESS_TOKEN: 'EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD',
  FACEBOOK_PAGE_ID: '416426288211518',
  WEBHOOK_VERIFY_TOKEN: 'live_loom_verify_123'
};

console.log('🔧 Netlify Environment Variables Setup');
console.log('=====================================');
console.log('');
console.log('Copy these variables to your Netlify dashboard:');
console.log('Site Settings → Environment Variables');
console.log('');
console.log('📋 Variables to add:');
console.log('');

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`Variable Name: ${key}`);
  console.log(`Value: ${value}`);
  console.log('---');
});

console.log('');
console.log('⚠️  Important:');
console.log('- Replace "your_supabase_service_key" with your actual Supabase service role key');
console.log('- Save each variable in Netlify dashboard');
console.log('- Redeploy your site after adding all variables');
console.log('');
console.log('🎯 Your webhook URL will be:');
console.log('https://your-site-name.netlify.app/.netlify/functions/facebook-webhook-enhanced');
