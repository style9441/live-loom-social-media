const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Facebook webhook verification endpoint
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'live_loom_verify_123';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('Verification request:', { mode, token, challenge });
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Facebook webhook event endpoint
app.post('/webhook', (req, res) => {
  console.log('📨 Received webhook event:', JSON.stringify(req.body, null, 2));
  
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

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Facebook Webhook Server is running!');
});

app.listen(port, () => {
  console.log(`🚀 Webhook server running at http://localhost:${port}`);
  console.log(`📡 Webhook URL: http://localhost:${port}/webhook`);
  console.log(`🔑 Verify Token: live_loom_verify_123`);
});
