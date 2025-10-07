// Glitch.com webhook handler for Facebook
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Facebook webhook verification endpoint
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'live_loom_verify_123';
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('Verification request:', { mode, token, challenge });
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Facebook webhook events endpoint
app.post('/webhook', (req, res) => {
  console.log('Webhook event:', JSON.stringify(req.body, null, 2));
  
  const body = req.body;
  
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        if (change.field === 'feed' && change.value) {
          const comment = change.value;
          
          if (comment.item === 'comment') {
            console.log('New comment:', {
              comment_id: comment.comment_id,
              from: comment.from?.name,
              message: comment.message
            });
          }
        }
      });
    });
  }
  
  res.status(200).send('OK');
});

// Health check
app.get('/', (req, res) => {
  res.send('Facebook Webhook Server is running!');
});

// Listen on the port that Glitch provides
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Facebook webhook server is running on port ' + listener.address().port);
});
