// Simple webhook handler for Facebook verification
const express = require('express');
const app = express();
const port = 3001; // Different port to avoid conflict

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Facebook webhook verification endpoint
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'live_loom_verify_123';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('🔍 Verification request received:', { 
    mode, 
    token, 
    challenge: challenge ? challenge.substring(0, 10) + '...' : 'none' 
  });
  
  // Facebook webhook verification
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    console.log('Expected token:', VERIFY_TOKEN);
    console.log('Received token:', token);
    res.status(403).send('Forbidden');
  }
});

// Facebook webhook events endpoint
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook event received:', JSON.stringify(req.body, null, 2));
  
  // Process webhook events
  const body = req.body;
  
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.field === 'feed' && change.value) {
          const comment = change.value;
          
          if (comment.item === 'comment') {
            console.log('💬 New comment received:', {
              comment_id: comment.comment_id,
              from: comment.from?.name,
              message: comment.message
            });
            
            // Here you would process the comment and send a reply
            // For now, just log it
          }
        }
      });
    });
  }
  
  res.status(200).send('OK');
});

// Health check
app.get('/', (req, res) => {
  res.send(`
    <h1>Facebook Webhook Server</h1>
    <p>Server is running on port ${port}</p>
    <p>Webhook URL: http://localhost:${port}/webhook</p>
    <p>Verify Token: live_loom_verify_123</p>
    <p>Test URL: <a href="/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123">Test Verification</a></p>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Facebook webhook server running on port ${port}`);
  console.log(`📡 Webhook URL: http://localhost:${port}/webhook`);
  console.log(`🔑 Verify Token: live_loom_verify_123`);
  console.log(`🌐 Test URL: http://localhost:${port}/webhook?hub.mode=subscribe&hub.challenge=test123&hub.verify_token=live_loom_verify_123`);
});
