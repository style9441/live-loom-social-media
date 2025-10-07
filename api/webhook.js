// Vercel serverless function for Facebook webhook
export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle webhook verification (GET request)
  if (req.method === 'GET') {
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
    return;
  }
  
  // Handle webhook events (POST request)
  if (req.method === 'POST') {
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
    return;
  }
  
  res.status(405).send('Method not allowed');
}
