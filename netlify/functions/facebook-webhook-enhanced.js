// Enhanced Facebook webhook with template system and private replies
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://ouaqeiixottdvyxpuecl.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_key';

// Facebook configuration
const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'EAAPMyZCcZBZCbgBPlZCMKd5IYjXIyLGzG3O76ydh6u28YHZASpSQOH4hJjToeM7G2lJAdjMUYZAspE4lxzj0KcVApqzUoGm9AVCgSZAZAEHZCIDbAIStEQsHI17evj8hC1spEgLrZANdaZBAHO5Pm53TyzwdxuN3ZCDq2FdWHCpRvPYRE99M4Xo0uCvzH8dfPvdJWqxk8QUaZC1kwJjMKrZBVy2DirTzWhem92fmTVxGQnHvN27hrZBfgZDZD';
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID || '416426288211518';

const supabase = createClient(supabaseUrl, supabaseKey);

// Reply templates
const replyTemplates = {
  "templates": [
    {
      "id": 1,
      "name": "Welcome Message 1",
      "template": "Hi {{name}}! 👋 Thanks for your comment! We're excited to connect with you. Feel free to reach out if you have any questions!",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Welcome Message 2", 
      "template": "Hey {{name}}! 😊 Thanks for engaging with our content! We'd love to hear more from you. Drop us a message anytime!",
      "is_active": true
    },
    {
      "id": 3,
      "name": "Welcome Message 3",
      "template": "Hello {{name}}! 🎉 Thanks for your comment! We appreciate your support and would love to connect with you personally.",
      "is_active": true
    },
    {
      "id": 4,
      "name": "Welcome Message 4",
      "template": "Hi {{name}}! 💫 Thanks for your comment! We're here to help and would love to chat with you. Send us a message!",
      "is_active": true
    },
    {
      "id": 5,
      "name": "Product Inquiry",
      "template": "Hi {{name}}! 🛍️ Thanks for your interest! We'd love to tell you more about our products. Send us a message and we'll get back to you right away!",
      "is_active": true
    },
    {
      "id": 6,
      "name": "Support Message",
      "template": "Hello {{name}}! 🆘 We're here to help! If you need any support or have questions, just send us a message and our team will assist you.",
      "is_active": true
    }
  ],
  "settings": {
    "default_template": 1,
    "randomize_templates": true,
    "include_emoji": true,
    "max_message_length": 1000
  }
};

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
                
                // Check if we've already replied to this comment
                const { data: existingComment } = await supabase
                  .from('test_comments')
                  .select('*')
                  .eq('comment_id', comment.comment_id)
                  .single();
                
                if (existingComment && existingComment.replied) {
                  console.log('ℹ️ Already replied to this comment, skipping');
                  continue;
                }
                
                // Store comment in database
                const { data: storedComment, error: storeError } = await supabase
                  .from('test_comments')
                  .upsert({
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
    
    // Create personalized message using templates
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
      
      // Log the error
      await logInteraction(comment, message, { error: result });
    }
    
  } catch (error) {
    console.error('❌ Error sending private reply:', error);
  }
}

// Function to create personalized messages using templates
function createPersonalizedMessage(commenterName, commentText) {
  const name = commenterName || 'there';
  
  // Get active templates
  const activeTemplates = replyTemplates.templates.filter(t => t.is_active);
  
  // Select template based on comment content or random
  let selectedTemplate;
  
  // Check for keywords in comment
  const lowerComment = commentText.toLowerCase();
  
  if (lowerComment.includes('product') || lowerComment.includes('buy') || lowerComment.includes('price')) {
    selectedTemplate = activeTemplates.find(t => t.name === 'Product Inquiry') || activeTemplates[0];
  } else if (lowerComment.includes('help') || lowerComment.includes('support') || lowerComment.includes('problem')) {
    selectedTemplate = activeTemplates.find(t => t.name === 'Support Message') || activeTemplates[0];
  } else if (replyTemplates.settings.randomize_templates) {
    // Random selection
    const randomIndex = Math.floor(Math.random() * activeTemplates.length);
    selectedTemplate = activeTemplates[randomIndex];
  } else {
    // Use default template
    selectedTemplate = activeTemplates.find(t => t.id === replyTemplates.settings.default_template) || activeTemplates[0];
  }
  
  // Replace template variables
  let message = selectedTemplate.template.replace(/\{\{name\}\}/g, name);
  
  // Ensure message length is within limits
  if (message.length > replyTemplates.settings.max_message_length) {
    message = message.substring(0, replyTemplates.settings.max_message_length - 3) + '...';
  }
  
  return message;
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
