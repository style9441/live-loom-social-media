// Simple test webhook for debugging
exports.handler = async (event, context) => {
  console.log('=== WEBHOOK TEST ===');
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Query:', JSON.stringify(event.queryStringParameters, null, 2));
  console.log('Body:', event.body);
  console.log('==================');

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

  // Handle GET request (webhook verification)
  if (event.httpMethod === 'GET') {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': verifyToken } = event.queryStringParameters || {};
    
    console.log('Verification attempt:', { mode, challenge, verifyToken });
    
    if (mode === 'subscribe' && verifyToken === 'live_loom_verify_123') {
      console.log('✅ Webhook verified successfully!');
      return {
        statusCode: 200,
        headers,
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

  // Handle POST request (webhook events)
  if (event.httpMethod === 'POST') {
    console.log('📨 Received webhook event!');
    
    try {
      const body = JSON.parse(event.body || '{}');
      console.log('Event data:', JSON.stringify(body, null, 2));
      
      // Log to a simple response
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Webhook received successfully',
          timestamp: new Date().toISOString(),
          eventType: body.object || 'unknown'
        }),
      };
    } catch (error) {
      console.error('Error parsing webhook data:', error);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: 'Method not allowed',
  };
};
