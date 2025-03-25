
export const generateEmbedScript = (
  webhookUrl: string, 
  options: {
    position?: string;
    isInline?: boolean;
    targetSelector?: string | null;
    width?: string;
    height?: string;
    chatTitle?: string;
    inputPlaceholder?: string;
    emptyStateText?: string;
  }
) => {
  const positionClass = options.position || 'bottom-right';
  const isInline = options.isInline || false;
  const targetSelector = options.targetSelector || '#chat-container';
  const width = options.width || '100%';
  const height = options.height || '500px';
  const chatTitle = options.chatTitle || 'Support Chat';
  const inputPlaceholder = options.inputPlaceholder || 'Type a message...';
  const emptyStateText = options.emptyStateText || 'Send a message to start chatting';
  
  return `<script>
(function() {
  // Initialize the chat widget
  document.addEventListener('DOMContentLoaded', function() {
    // Create stylesheet
    const style = document.createElement('style');
    style.innerHTML = \`
      .chat-widget-container {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        ${!isInline ? \`
          position: fixed;
          ${positionClass.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          ${positionClass.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          z-index: 9999;
          \` : \`
          width: ${width};
          height: ${height};
          \`}
      }
      .chat-widget-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: #2563eb;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
      }
      .chat-widget-button:hover {
        transform: scale(1.05);
      }
      .chat-widget-window {
        display: ${isInline ? 'flex' : 'none'};
        flex-direction: column;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${isInline ? \`
          width: 100%;
          height: 100%;
          \` : \`
          width: 350px;
          height: 500px;
          position: absolute;
          bottom: ${positionClass.includes('bottom') ? '70px' : '0'};
          ${positionClass.includes('right') ? 'right: 0;' : 'left: 0;'}
          \`}
      }
      .chat-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: #2563eb;
        color: white;
      }
      .chat-widget-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
      .chat-widget-header-buttons {
        display: flex;
        gap: 8px;
      }
      .chat-widget-icon-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }
      .chat-widget-icon-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .chat-widget-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #f9fafb;
      }
      .chat-widget-empty-state {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
      }
      .chat-widget-message {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
      }
      .chat-widget-message-user {
        align-items: flex-end;
      }
      .chat-widget-message-agent {
        align-items: flex-start;
      }
      .chat-widget-message-bubble {
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 80%;
        word-break: break-word;
      }
      .chat-widget-message-user .chat-widget-message-bubble {
        background-color: #2563eb;
        color: white;
      }
      .chat-widget-message-agent .chat-widget-message-bubble {
        background-color: #e5e7eb;
        color: #1f2937;
      }
      .chat-widget-message-time {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }
      .chat-widget-input-container {
        padding: 12px;
        border-top: 1px solid #e5e7eb;
      }
      .chat-widget-form {
        display: flex;
        gap: 8px;
      }
      .chat-widget-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 14px;
      }
      .chat-widget-input:focus {
        outline: 2px solid #2563eb;
        border-color: transparent;
      }
      .chat-widget-send-button {
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        cursor: pointer;
        font-weight: 500;
      }
      .chat-widget-send-button:hover {
        background-color: #1d4ed8;
      }
    \`;
    document.head.appendChild(style);

    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget-container';
    
    let chatMessages = [];
    const threadId = 'chat_' + Math.random().toString(36).substring(2, 15);
    
    // Create different elements based on whether it's inline or fixed position
    if (isInline) {
      const targetElement = document.querySelector('${targetSelector}');
      if (!targetElement) {
        console.error('Chat widget target element not found: ${targetSelector}');
        return;
      }
      
      const chatWindow = createChatWindow();
      chatWidget.appendChild(chatWindow);
      targetElement.appendChild(chatWidget);
    } else {
      // Create chat bubble button
      const chatButton = document.createElement('div');
      chatButton.className = 'chat-widget-button';
      chatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
      chatButton.addEventListener('click', toggleChat);
      
      const chatWindow = createChatWindow();
      chatWindow.style.display = 'none';
      
      chatWidget.appendChild(chatButton);
      chatWidget.appendChild(chatWindow);
      document.body.appendChild(chatWidget);
    }
    
    function createChatWindow() {
      const chatWindow = document.createElement('div');
      chatWindow.className = 'chat-widget-window';
      
      // Header
      const header = document.createElement('div');
      header.className = 'chat-widget-header';
      
      const title = document.createElement('h3');
      title.textContent = '${chatTitle}';
      
      const headerButtons = document.createElement('div');
      headerButtons.className = 'chat-widget-header-buttons';
      
      if (!isInline) {
        const minimizeButton = document.createElement('button');
        minimizeButton.className = 'chat-widget-icon-button';
        minimizeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        minimizeButton.addEventListener('click', toggleChat);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'chat-widget-icon-button';
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeButton.addEventListener('click', toggleChat);
        
        headerButtons.appendChild(minimizeButton);
        headerButtons.appendChild(closeButton);
      }
      
      header.appendChild(title);
      header.appendChild(headerButtons);
      
      // Messages container
      const messagesContainer = document.createElement('div');
      messagesContainer.className = 'chat-widget-messages';
      
      // Empty state
      const emptyState = document.createElement('div');
      emptyState.className = 'chat-widget-empty-state';
      emptyState.textContent = '${emptyStateText}';
      messagesContainer.appendChild(emptyState);
      
      // Input container
      const inputContainer = document.createElement('div');
      inputContainer.className = 'chat-widget-input-container';
      
      const form = document.createElement('form');
      form.className = 'chat-widget-form';
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage();
      });
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'chat-widget-input';
      input.placeholder = '${inputPlaceholder}';
      
      const sendButton = document.createElement('button');
      sendButton.type = 'submit';
      sendButton.className = 'chat-widget-send-button';
      sendButton.textContent = 'Send';
      
      form.appendChild(input);
      form.appendChild(sendButton);
      inputContainer.appendChild(form);
      
      chatWindow.appendChild(header);
      chatWindow.appendChild(messagesContainer);
      chatWindow.appendChild(inputContainer);
      
      return chatWindow;
    }
    
    function toggleChat() {
      const chatWindow = document.querySelector('.chat-widget-window');
      const currentDisplay = getComputedStyle(chatWindow).display;
      chatWindow.style.display = currentDisplay === 'none' ? 'flex' : 'none';
    }
    
    function sendMessage() {
      const input = document.querySelector('.chat-widget-input');
      const messagesContainer = document.querySelector('.chat-widget-messages');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Clear empty state if this is the first message
      if (chatMessages.length === 0) {
        messagesContainer.innerHTML = '';
      }
      
      // Add message to UI
      const messageElement = createMessageElement('user', message);
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Clear input
      input.value = '';
      
      // Store message
      const messageObj = {
        id: 'msg_' + Date.now(),
        text: message,
        sender: 'user',
        timestamp: Date.now()
      };
      chatMessages.push(messageObj);
      
      // Call webhook
      if ('${webhookUrl}') {
        callWebhook(message);
      }
    }
    
    function createMessageElement(sender, text) {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'chat-widget-message chat-widget-message-' + sender;
      
      const bubble = document.createElement('div');
      bubble.className = 'chat-widget-message-bubble';
      bubble.textContent = text;
      
      const timestamp = document.createElement('div');
      timestamp.className = 'chat-widget-message-time';
      
      // Format timestamp based on locale
      const now = new Date();
      timestamp.textContent = now.toLocaleTimeString();
      
      messageContainer.appendChild(bubble);
      messageContainer.appendChild(timestamp);
      
      return messageContainer;
    }
    
    function callWebhook(message) {
      fetch('${webhookUrl}', {
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
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.messages && data.messages.length > 0) {
          // Add agent responses to UI
          const messagesContainer = document.querySelector('.chat-widget-messages');
          
          data.messages.forEach(msg => {
            // Add to messages array
            chatMessages.push(msg);
            
            // Add to UI
            const messageElement = createMessageElement('agent', msg.text);
            messagesContainer.appendChild(messageElement);
          });
          
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else if (data.status === 'error') {
          console.error('Error from webhook:', data.error);
        }
      })
      .catch(error => {
        console.error('Error calling webhook:', error);
      });
    }
  });
})();
</script>`;
};
