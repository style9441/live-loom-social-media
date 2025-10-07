// Complete Facebook webhook with private reply system
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://ouaqeiixottdvyxpuecl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_key';

// Facebook configuration
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD';
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '416426288211518';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('Request method:', event.httpMethod);
    console.log('Request body:', event.body);
    
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
          headers: { 'Content-Type': 'text/plain', ...headers },
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
        for (const entry of body.entry) {
          for (const change of entry.changes) {
            if (change.field === 'feed' && change.value) {
              const comment = change.value;
              
              if (comment.item === 'comment') {
                console.log('💬 Processing comment:', comment.comment_id);
                
                // Store comment in database
                const { data: storedComment, error: storeError } = await supabase
                  .from('test_comments')
                  .insert({
                    comment_id: comment.comment_id,
                    commenter_id: comment.from?.id,
                    comment_text: comment.message,
                    replied: false
                  })
                  .select()
                  .single();
                
                if (storeError) {
                  console.error('❌ Error storing comment:', storeError);
                } else {
                  console.log('✅ Comment stored:', storedComment);
                  
                  // Send private reply
                  await sendPrivateReply(comment);
                }
              }
            }
          }
        }
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

// Function to send private reply via Facebook Graph API
async function sendPrivateReply(comment) {
  try {
    const commenterId = comment.from?.id;
    const commenterName = comment.from?.name;
    
    if (!commenterId) {
      console.log('❌ No commenter ID found');
      return;
    }
    
    // Create personalized message
    const message = createPersonalizedMessage(commenterName, comment.message);
    
    // Send private message via Facebook Graph API
    const messageData = {
      recipient: { id: commenterId },
      message: { text: message }
    };
    
    console.log('📤 Sending private message to:', commenterId);
    console.log('💬 Message:', message);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      }
    );
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Private message sent successfully:', result);
      
      // Update comment as replied in database
      await supabase
        .from('test_comments')
        .update({ replied: true })
        .eq('comment_id', comment.comment_id);
      
      // Log the interaction
      await logInteraction(comment, message, result);
      
    } else {
      console.error('❌ Failed to send private message:', result);
    }
    
  } catch (error) {
    console.error('❌ Error sending private reply:', error);
  }
}

// Function to create personalized messages
function createPersonalizedMessage(commenterName, commentText) {
  const name = commenterName || 'there';
  
  // Simple message templates
  const messages = [
    `Hi ${name}! 👋 Thanks for your comment! We're excited to connect with you. Feel free to reach out if you have any questions!`,
    `Hey ${name}! 😊 Thanks for engaging with our content! We'd love to hear more from you. Drop us a message anytime!`,
    `Hello ${name}! 🎉 Thanks for your comment! We appreciate your support and would love to connect with you personally.`,
    `Hi ${name}! 💫 Thanks for your comment! We're here to help and would love to chat with you. Send us a message!`
  ];
  
  // Select message based on comment content or random
  const messageIndex = Math.floor(Math.random() * messages.length);
  return messages[messageIndex];
}

// Function to log interactions for analytics
async function logInteraction(comment, replyMessage, apiResponse) {
  try {
    const { error } = await supabase
      .from('interaction_logs')
      .insert({
        comment_id: comment.comment_id,
        commenter_id: comment.from?.id,
        commenter_name: comment.from?.name,
        comment_text: comment.message,
        reply_message: replyMessage,
        api_response: apiResponse,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('❌ Error logging interaction:', error);
    } else {
      console.log('✅ Interaction logged successfully');
    }
  } catch (error) {
    console.error('❌ Error in logInteraction:', error);
  }
}
