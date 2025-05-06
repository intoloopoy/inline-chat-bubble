import { hideTypingIndicator } from './dom';

/**
 * Call the webhook with the user's message
 */
export const callWebhook = (
  message: string,
  webhookUrl: string,
  chatMessages: any[],
  threadId: string,
  chatTitle: string,
  callbacks: {
    onStart: () => void;
    onSuccess: (messages: any[]) => void;
    onError: () => void;
    onComplete: () => void;
  }
) => {
  callbacks.onStart();
  
  // Create a timeout for the request
  const timeoutId = setTimeout(() => {
    hideTypingIndicator();
    callbacks.onComplete();
    
    const messagesContainer = document.querySelector('.chat-widget-messages');
    if (messagesContainer) {
      const errorMessageObj = {
        id: 'err_' + Date.now(),
        text: 'Sorry, the request timed out. Please try again later.',
        sender: 'agent',
        timestamp: Date.now()
      };
      
      callbacks.onSuccess([errorMessageObj]);
    }
  }, 90000); // 90-second timeout
  
  // Extract URL parameters if present
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('user_id');
  const moduleId = urlParams.get('module_id');
  
  // Get parent page URL if in an iframe, otherwise use current URL
  let pageUrl = window.location.href;
  try {
    if (window.parent !== window) {
      // We're in an iframe
      pageUrl = document.referrer || window.parent.location.href;
    }
  } catch (e) {
    // If we can't access parent due to cross-origin restrictions, fallback to referrer
    pageUrl = document.referrer || window.location.href;
  }
  
  // Create payload with chat title, URL parameters, and page URL
  const payload: Record<string, any> = {
    message: message,
    messages: chatMessages,
    threadId: threadId,
    chat_title: chatTitle,
    page_url: pageUrl // Use parent page URL when embedded
  };
  
  // Add URL parameters if present
  if (userId) payload.user_id = userId;
  if (moduleId) payload.module_id = moduleId;
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(response => {
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.text();
  })
  .then(responseText => {
    let data;
    try {
      // Try to parse the response as JSON
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Invalid JSON response:', responseText);
      // Try to handle common issues like unescaped newlines or quotes
      try {
        // Try to sanitize and parse the response
        const sanitizedText = responseText
          .replace(/[\n\r]+/g, ' ')
          .replace(/([^\\])(["'])([\s\S]*?)\2/g, (match, p1, p2, p3) => {
            return p1 + p2 + p3.replace(/['"]/g, '\\"') + p2;
          });
        data = JSON.parse(sanitizedText);
        console.log('Sanitized JSON successfully parsed:', data);
      } catch (sanitizeError) {
        // If both parsing attempts fail, we'll create a simpler fallback response object
        console.error('Failed to parse even with sanitization:', sanitizeError);
        data = {
          status: 'success',
          messages: [{
            id: 'msg_' + Date.now(),
            text: 'I received your message, but had trouble processing the response. Please try again or contact support.',
            sender: 'agent',
            timestamp: Date.now()
          }]
        };
      }
    }
    
    hideTypingIndicator();
    
    if (data.status === 'success' && data.messages && data.messages.length > 0) {
      callbacks.onSuccess(data.messages);
    } else if (data.status === 'error') {
      throw new Error(data.error || 'Unknown error from webhook');
    } else if (data.message) {
      // Some webhooks might return a single message instead of messages array
      callbacks.onSuccess([{
        id: 'msg_' + Date.now(),
        text: data.message,
        sender: 'agent',
        timestamp: Date.now()
      }]);
    } else {
      // Fallback for unexpected response format
      callbacks.onSuccess([{
        id: 'msg_' + Date.now(),
        text: 'Received response but couldn\'t process it correctly.',
        sender: 'agent',
        timestamp: Date.now()
      }]);
    }
  })
  .catch(error => {
    console.error('Error calling webhook:', error);
    
    clearTimeout(timeoutId);
    hideTypingIndicator();
    
    const errorMessageObj = {
      id: 'err_' + Date.now(),
      text: 'Sorry, an error occurred. Please try again later.',
      sender: 'agent',
      timestamp: Date.now()
    };
    
    callbacks.onSuccess([errorMessageObj]);
    callbacks.onError();
  })
  .finally(() => {
    callbacks.onComplete();
  });
};
