
import { createChatWindow, autoResize, createMessageElement, showTypingIndicator } from './dom';
import { callWebhook } from './api';
import { setLoadingState } from './state';
import { icons } from './icons';

interface ChatWidgetConfig {
  isInline: boolean;
  positionClass: string;
  targetSelector: string;
  width: string;
  height: string;
  chatTitle: string;
  inputPlaceholder: string;
  emptyStateText: string;
  webhookUrl: string;
}

/**
 * Initialize the chat widget
 */
export const initializeChatWidget = (config: ChatWidgetConfig) => {
  // Create chat widget elements
  const chatWidget = document.createElement('div');
  chatWidget.className = 'chat-widget-container';
  
  let chatMessages: any[] = [];
  const threadId = 'chat_' + Math.random().toString(36).substring(2, 15);
  (window as any).__chatWidgetIsLoading = false;
  
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
    
    const chatWindow = createChatWindow(config);
    chatWidget.appendChild(chatWindow);
    targetElement.appendChild(chatWidget);
  } else {
    // Create chat bubble button
    const chatButton = document.createElement('div');
    chatButton.className = 'chat-widget-button';
    chatButton.innerHTML = icons.chatBubble;
    chatButton.addEventListener('click', () => {
      const chatWindow = document.querySelector('.chat-widget-window');
      if (chatWindow) {
        // Type assertion to HTMLElement to use style property
        const chatWindowElement = chatWindow as HTMLElement;
        const currentDisplay = getComputedStyle(chatWindowElement).display;
        chatWindowElement.style.display = currentDisplay === 'none' ? 'flex' : 'none';
      }
    });
    
    const chatWindow = createChatWindow(config);
    // Type assertion to HTMLElement to use style property
    (chatWindow as HTMLElement).style.display = 'none';
    
    chatWidget.appendChild(chatButton);
    chatWidget.appendChild(chatWindow);
    document.body.appendChild(chatWidget);
  }
  
  // Initialize the sendMessage function
  (window as any).sendMessage = function() {
    const textarea = document.querySelector('.chat-widget-textarea') as HTMLTextAreaElement;
    const messagesContainer = document.querySelector('.chat-widget-messages');
    
    if (!textarea || !messagesContainer) return;
    
    const message = textarea.value.trim();
    const isLoading = (window as any).__chatWidgetIsLoading;
    
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
      callWebhook(
        message, 
        config.webhookUrl, 
        chatMessages, 
        threadId,
        config.chatTitle,
        {
          onStart: () => {
            setLoadingState(true);
          },
          onSuccess: (messages) => {
            // Add agent responses to UI
            const messagesContainer = document.querySelector('.chat-widget-messages');
            if (!messagesContainer) return;
            
            messages.forEach(msg => {
              // Add to messages array
              chatMessages.push(msg);
              
              // Add to UI
              const messageElement = createMessageElement('agent', msg.text);
              messagesContainer.appendChild(messageElement);
            });
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          },
          onError: () => {
            // Error handling is done in the callWebhook function
          },
          onComplete: () => {
            setLoadingState(false);
          }
        }
      );
    }
  };
};
