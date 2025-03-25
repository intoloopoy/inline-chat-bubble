
import { hideTypingIndicator } from './dom';

/**
 * Call the webhook with the user's message
 */
export const callWebhook = (
  message: string,
  webhookUrl: string,
  chatMessages: any[],
  threadId: string,
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
  }, 30000); // 30-second timeout
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      messages: chatMessages,
      threadId: threadId
    }),
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
      throw new Error('Invalid response from server');
    }
    
    hideTypingIndicator();
    
    if (data.status === 'success' && data.messages && data.messages.length > 0) {
      callbacks.onSuccess(data.messages);
    } else if (data.status === 'error') {
      throw new Error(data.error || 'Unknown error from webhook');
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
