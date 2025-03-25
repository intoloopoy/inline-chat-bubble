
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
    // Define configuration options
    const config = {
      isInline: ${isInline},
      positionClass: "${positionClass}",
      targetSelector: "${targetSelector}",
      width: "${width}",
      height: "${height}",
      chatTitle: "${chatTitle}",
      inputPlaceholder: "${inputPlaceholder}",
      emptyStateText: "${emptyStateText}",
      webhookUrl: "${webhookUrl}"
    };
    
    // Create stylesheet
    const style = document.createElement('style');
    style.innerHTML = \`
      :root {
        --primary: #2563eb;
        --primary-foreground: #ffffff;
        --background: #ffffff;
        --muted: #f9fafb;
        --muted-foreground: #6b7280;
        --border: #e5e7eb;
        --chat-bubble: #e5e7eb;
        --chat-bubble-foreground: #1f2937;
        --chat-user-bubble: #2563eb;
        --chat-user-bubble-foreground: #ffffff;
      }
      
      .dark-mode {
        --primary: #2563eb;
        --primary-foreground: #ffffff;
        --background: #1f2937;
        --muted: #374151;
        --muted-foreground: #9ca3af;
        --border: #374151;
        --chat-bubble: #374151;
        --chat-bubble-foreground: #f9fafb;
        --chat-user-bubble: #2563eb;
        --chat-user-bubble-foreground: #ffffff;
      }
      
      .chat-widget-container {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        \${!config.isInline ? \`
          position: fixed;
          \${config.positionClass.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          \${config.positionClass.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          z-index: 9999;
          \` : \`
          width: \${config.width};
          height: \${config.height};
          \`}
      }
      .chat-widget-button {
        width: 56px;
        height: 56px;
        border-radius: 9999px;
        background-color: var(--primary);
        color: var(--primary-foreground);
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
        display: \${config.isInline ? 'flex' : 'none'};
        flex-direction: column;
        background-color: var(--background);
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border);
        \${config.isInline ? \`
          width: 100%;
          height: 100%;
          \` : \`
          width: 350px;
          height: 500px;
          position: absolute;
          bottom: \${config.positionClass.includes('bottom') ? '70px' : '0'};
          \${config.positionClass.includes('right') ? 'right: 0;' : 'left: 0;'}
          \`}
      }
      .chat-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background-color: var(--primary);
        color: var(--primary-foreground);
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
        color: var(--primary-foreground);
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
      }
      .chat-widget-icon-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .chat-widget-icon-button svg {
        width: 16px;
        height: 16px;
      }
      .chat-widget-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: var(--muted);
        display: flex;
        flex-direction: column;
        gap: 10px;
        scroll-behavior: smooth;
      }
      .chat-widget-empty-state {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--muted-foreground);
      }
      .chat-widget-message {
        display: flex;
        flex-direction: column;
        animation: fadein 0.3s ease-in-out;
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
        max-width: 85%;
        word-break: break-word;
      }
      .chat-widget-message-user .chat-widget-message-bubble {
        background-color: var(--chat-user-bubble);
        color: var(--chat-user-bubble-foreground);
        border-radius: 16px 16px 0 16px;
      }
      .chat-widget-message-agent .chat-widget-message-bubble {
        background-color: var(--chat-bubble);
        color: var(--chat-bubble-foreground);
        border-radius: 16px 16px 16px 0;
      }
      .chat-widget-message-time {
        font-size: 12px;
        color: var(--muted-foreground);
        margin-top: 4px;
      }
      .chat-widget-input-container {
        padding: 12px;
        border-top: 1px solid var(--border);
        background-color: var(--background);
      }
      .chat-widget-form {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }
      .chat-widget-textarea {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border);
        border-radius: 6px;
        font-size: 14px;
        min-height: 40px;
        max-height: 120px;
        resize: none;
        background-color: var(--background);
        color: inherit;
        font-family: inherit;
        overflow-y: auto;
      }
      .chat-widget-textarea:focus {
        outline: 2px solid var(--primary);
        border-color: transparent;
      }
      .chat-widget-send-button {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border: none;
        border-radius: 9999px;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }
      .chat-widget-send-button:hover {
        background-color: #1d4ed8;
      }
      .chat-widget-send-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .chat-widget-loader {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
      }
      .chat-widget-typing {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background-color: var(--chat-bubble);
        color: var(--chat-bubble-foreground);
        border-radius: 16px 16px 16px 0;
        align-self: flex-start;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .chat-widget-typing-dots {
        display: flex;
      }
      .chat-widget-typing-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: currentColor;
        margin: 0 1px;
        animation: typingAnimation 1.4s infinite ease-in-out;
      }
      .chat-widget-typing-dot:nth-child(1) {
        animation-delay: 0s;
      }
      .chat-widget-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .chat-widget-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadein {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes typingAnimation {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      .chat-message-content a {
        color: #2563eb;
        text-decoration: underline;
      }
      .chat-message-content ul, .chat-message-content ol {
        padding-left: 1.5em;
        margin: 0.5em 0;
      }
      .chat-message-content pre {
        background: rgba(0, 0, 0, 0.05);
        padding: 0.5em;
        border-radius: 4px;
        overflow-x: auto;
        font-family: monospace;
      }
      .chat-message-content code {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.05);
        padding: 0.1em 0.3em;
        border-radius: 3px;
      }
      .chat-message-content p {
        margin: 0.5em 0;
      }
      .chat-message-content p:first-child {
        margin-top: 0;
      }
      .chat-message-content p:last-child {
        margin-bottom: 0;
      }
    \`;
    document.head.appendChild(style);

    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget-container';
    
    let chatMessages = [];
    const threadId = 'chat_' + Math.random().toString(36).substring(2, 15);
    let isLoading = false;
    
    // Detect dark mode preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark-mode');
    }
    
    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    });
    
    // Create different elements based on whether it's inline or fixed position
    if (config.isInline) {
      const targetElement = document.querySelector(config.targetSelector);
      if (!targetElement) {
        console.error('Chat widget target element not found: ' + config.targetSelector);
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
      title.textContent = config.chatTitle;
      
      const headerButtons = document.createElement('div');
      headerButtons.className = 'chat-widget-header-buttons';
      
      if (!config.isInline) {
        const minimizeButton = document.createElement('button');
        minimizeButton.className = 'chat-widget-icon-button';
        minimizeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        minimizeButton.addEventListener('click', toggleChat);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'chat-widget-icon-button';
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
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
      emptyState.textContent = config.emptyStateText;
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
      
      const textarea = document.createElement('textarea');
      textarea.className = 'chat-widget-textarea';
      textarea.placeholder = config.inputPlaceholder;
      textarea.rows = 1;
      textarea.addEventListener('input', function() {
        autoResize(this);
      });
      textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      
      const sendButton = document.createElement('button');
      sendButton.type = 'submit';
      sendButton.className = 'chat-widget-send-button';
      sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
      
      form.appendChild(textarea);
      form.appendChild(sendButton);
      inputContainer.appendChild(form);
      
      chatWindow.appendChild(header);
      chatWindow.appendChild(messagesContainer);
      chatWindow.appendChild(inputContainer);
      
      return chatWindow;
    }
    
    function autoResize(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      
      // Update send button disabled state
      const sendButton = textarea.form.querySelector('.chat-widget-send-button');
      sendButton.disabled = textarea.value.trim() === '' || isLoading;
    }
    
    function toggleChat() {
      const chatWindow = document.querySelector('.chat-widget-window');
      const currentDisplay = getComputedStyle(chatWindow).display;
      chatWindow.style.display = currentDisplay === 'none' ? 'flex' : 'none';
    }
    
    function sendMessage() {
      const textarea = document.querySelector('.chat-widget-textarea');
      const messagesContainer = document.querySelector('.chat-widget-messages');
      const message = textarea.value.trim();
      
      if (!message || isLoading) return;
      
      // Clear empty state if this is the first message
      if (chatMessages.length === 0) {
        messagesContainer.innerHTML = '';
      }
      
      // Add message to UI
      const messageElement = createMessageElement('user', message);
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Clear input and resize
      textarea.value = '';
      autoResize(textarea);
      
      // Store message
      const messageObj = {
        id: 'msg_' + Date.now(),
        text: message,
        sender: 'user',
        timestamp: Date.now()
      };
      chatMessages.push(messageObj);
      
      // Show typing indicator
      showTypingIndicator();
      
      // Call webhook
      if (config.webhookUrl) {
        callWebhook(message);
      }
    }
    
    function showTypingIndicator() {
      const messagesContainer = document.querySelector('.chat-widget-messages');
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-widget-typing';
      typingIndicator.innerHTML = 'Typing<div class="chat-widget-typing-dots"><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div></div>';
      typingIndicator.id = 'typing-indicator';
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
    
    function createMessageElement(sender, text) {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'chat-widget-message chat-widget-message-' + sender;
      
      const bubble = document.createElement('div');
      bubble.className = 'chat-widget-message-bubble';
      
      if (sender === 'user') {
        bubble.textContent = text;
      } else {
        // For agent messages, support HTML content (links, formatting)
        bubble.classList.add('chat-message-content');
        bubble.innerHTML = processMessageText(text);
      }
      
      const timestamp = document.createElement('div');
      timestamp.className = 'chat-widget-message-time';
      
      // Format timestamp based on locale
      const now = new Date();
      timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      messageContainer.appendChild(bubble);
      messageContainer.appendChild(timestamp);
      
      return messageContainer;
    }
    
    function processMessageText(text) {
      // Basic processing for links, code blocks, and lists
      let processed = text
        // Convert URLs to links
        .replace(/(https?:\\/\\/[^\\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
        // Process code blocks
        .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre>$1</pre>')
        // Process inline code
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
        // Add line breaks
        .replace(/\\n/g, '<br />');
      
      return processed;
    }
    
    function callWebhook(message) {
      isLoading = true;
      const sendButton = document.querySelector('.chat-widget-send-button');
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.innerHTML = '<div class="chat-widget-loader"></div>';
      }
      
      // Create a timeout for the request
      const timeoutId = setTimeout(() => {
        isLoading = false;
        hideTypingIndicator();
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
        
        const messagesContainer = document.querySelector('.chat-widget-messages');
        const errorMessage = createMessageElement('agent', 'Sorry, the request timed out. Please try again later.');
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 30000); // 30-second timeout
      
      fetch(config.webhookUrl, {
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
          throw new Error(\`Request failed with status \${response.status}\`);
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
          throw new Error(data.error || 'Unknown error from webhook');
        }
      })
      .catch(error => {
        console.error('Error calling webhook:', error);
        
        // Add error message to UI
        hideTypingIndicator();
        const messagesContainer = document.querySelector('.chat-widget-messages');
        const errorMessage = createMessageElement('agent', 'Sorry, an error occurred. Please try again later.');
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      })
      .finally(() => {
        isLoading = false;
        const sendButton = document.querySelector('.chat-widget-send-button');
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
      });
    }
  });
})();
</script>`;
};
