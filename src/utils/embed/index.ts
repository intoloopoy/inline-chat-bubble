
import { generateEmbedStyles } from './styles';
import { initializeChatWidget } from './initialize';

interface EmbedOptions {
  position?: string;
  isInline?: boolean;
  targetSelector?: string | null;
  width?: string;
  height?: string;
  chatTitle?: string;
  inputPlaceholder?: string;
  emptyStateText?: string;
}

/**
 * Generate embed script for the chat widget
 */
export const generateEmbedScript = (
  webhookUrl: string, 
  options: EmbedOptions
) => {
  const positionClass = options.position || 'bottom-right';
  const isInline = options.isInline || false;
  const targetSelector = options.targetSelector || '#chat-container';
  const width = options.width || '100%';
  const height = options.height || '500px';
  const chatTitle = options.chatTitle || 'Support Chat';
  const inputPlaceholder = options.inputPlaceholder || 'Type a message...';
  const emptyStateText = options.emptyStateText || 'Send a message to start chatting';
  
  const config = {
    isInline,
    positionClass,
    targetSelector,
    width,
    height,
    chatTitle,
    inputPlaceholder,
    emptyStateText,
    webhookUrl
  };
  
  const styles = generateEmbedStyles(config);
  
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
    style.innerHTML = \`${styles}\`;
    document.head.appendChild(style);

    // Get DOM functions ready
    const toggleChat = () => {
      const chatWindow = document.querySelector('.chat-widget-window');
      if (!chatWindow) return;
      
      const currentDisplay = getComputedStyle(chatWindow).display;
      chatWindow.style.display = currentDisplay === 'none' ? 'flex' : 'none';
    };

    const autoResize = (textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      
      // Update send button disabled state
      const sendButton = textarea.form.querySelector('.chat-widget-send-button');
      if (sendButton) {
        sendButton.disabled = textarea.value.trim() === '' || window.__chatWidgetIsLoading;
      }
    };

    const createMessageElement = (sender, text) => {
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
    };

    const showTypingIndicator = () => {
      const messagesContainer = document.querySelector('.chat-widget-messages');
      if (!messagesContainer) return;
      
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'chat-widget-typing';
      typingIndicator.innerHTML = 'Typing<div class="chat-widget-typing-dots"><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div></div>';
      typingIndicator.id = 'typing-indicator';
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const hideTypingIndicator = () => {
      const typingIndicator = document.getElementById('typing-indicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    };

    const processMessageText = (text) => {
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
    };

    const setLoadingState = (isLoading) => {
      window.__chatWidgetIsLoading = isLoading;
      
      const sendButton = document.querySelector('.chat-widget-send-button');
      if (sendButton) {
        const textarea = document.querySelector('.chat-widget-textarea');
        sendButton.disabled = isLoading || (textarea && textarea.value.trim() === '');
        
        if (isLoading) {
          sendButton.innerHTML = '<div class="chat-widget-loader"></div>';
        } else {
          sendButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
      }
    };

    const callWebhook = (message, webhookUrl, chatMessages, threadId) => {
      setLoadingState(true);
      
      // Create a timeout for the request
      const timeoutId = setTimeout(() => {
        hideTypingIndicator();
        setLoadingState(false);
        
        const messagesContainer = document.querySelector('.chat-widget-messages');
        if (messagesContainer) {
          const errorMessage = createMessageElement('agent', 'Sorry, the request timed out. Please try again later.');
          messagesContainer.appendChild(errorMessage);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
          if (!messagesContainer) return;
          
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
        
        clearTimeout(timeoutId);
        // Add error message to UI
        hideTypingIndicator();
        const messagesContainer = document.querySelector('.chat-widget-messages');
        if (messagesContainer) {
          const errorMessage = createMessageElement('agent', 'Sorry, an error occurred. Please try again later.');
          messagesContainer.appendChild(errorMessage);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      })
      .finally(() => {
        setLoadingState(false);
      });
    };

    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget-container';
    
    let chatMessages = [];
    const threadId = 'chat_' + Math.random().toString(36).substring(2, 15);
    window.__chatWidgetIsLoading = false;
    
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
    
    const createChatWindow = () => {
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
    };
    
    function sendMessage() {
      const textarea = document.querySelector('.chat-widget-textarea');
      const messagesContainer = document.querySelector('.chat-widget-messages');
      
      if (!textarea || !messagesContainer) return;
      
      const message = textarea.value.trim();
      
      if (!message || window.__chatWidgetIsLoading) return;
      
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
        callWebhook(message, config.webhookUrl, chatMessages, threadId);
      }
    }
    
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
  });
})();
</script>`;
};
