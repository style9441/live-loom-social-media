// Netlify serverless function for Facebook webhook
exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    console.log('Request method:', event.httpMethod);
    console.log('Request path:', event.path);
    
    // Handle webhook verification (GET request)
    if (event.httpMethod === 'GET') {
      const VERIFY_TOKEN = 'live_loom_verify_123';
      
      const mode = event.queryStringParameters['hub.mode'];
      const token = event.queryStringParameters['hub.verify_token'];
      const challenge = event.queryStringParameters['hub.challenge'];
      
      console.log('Verification params:', { mode, token, challenge });
      
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully');
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/plain',
            ...headers,
          },
          body: challenge,
        };
      } else {
        console.log('❌ Webhook verification failed');
        return {
          statusCode: 403,
          headers,
          body: 'Forbidden',
        };
      }
    }
    
    // Handle webhook events (POST request)
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      console.log('📨 Received webhook event:', JSON.stringify(body, null, 2));
      
      // Process webhook events
      if (body.object === 'page') {
        body.entry.forEach(entry => {
          entry.changes.forEach(change => {
            if (change.field === 'feed' && change.value) {
              const comment = change.value;
              
              if (comment.item === 'comment') {
                console.log('💬 New comment received:', {
                  comment_id: comment.comment_id,
                  from: comment.from?.name,
                  message: comment.message,
                });
                
                // Here you would process the comment and send a reply
                // For now, just log it
              }
            }
          });
        });
      }
      
      return {
        statusCode: 200,
        headers,
        body: 'OK',
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: 'Method not allowed',
    };
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return {
      statusCode: 500,
      headers,
      body: 'Internal Server Error',
    };
  }
};
