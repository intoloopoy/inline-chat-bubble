import { icons } from './icons';

interface ChatConfig {
  isInline: boolean;
  positionClass: string;
  targetSelector: string;
  width: string;
  height: string;
  chatTitle: string;
  inputPlaceholder: string;
  emptyStateText: string;
  typingText: string;
  webhookUrl: string;
}

/**
 * Create and render the chat window
 */
export const createChatWindow = (config: ChatConfig) => {
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
    minimizeButton.innerHTML = icons.minimize;
    minimizeButton.addEventListener('click', toggleChat);
    
    const closeButton = document.createElement('button');
    closeButton.className = 'chat-widget-icon-button';
    closeButton.innerHTML = icons.close;
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
    // Use window.sendMessage instead of direct sendMessage call
    if (typeof (window as any).sendMessage === 'function') {
      (window as any).sendMessage();
    }
  });
  
  const textarea = document.createElement('textarea');
  textarea.className = 'chat-widget-textarea';
  textarea.placeholder = config.inputPlaceholder;
  textarea.rows = 1;
  textarea.addEventListener('input', function() {
    autoResize(this);
  });
  
  // Updated to handle Ctrl+Enter or Cmd+Enter for submission instead of just Enter
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      // Use window.sendMessage instead of direct sendMessage call
      if (typeof (window as any).sendMessage === 'function') {
        (window as any).sendMessage();
      }
    }
  });
  
  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.className = 'chat-widget-send-button';
  sendButton.innerHTML = icons.send;
  
  form.appendChild(textarea);
  form.appendChild(sendButton);
  inputContainer.appendChild(form);
  
  chatWindow.appendChild(header);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
  
  return chatWindow;
};

/**
 * Toggle the chat window display
 */
export const toggleChat = () => {
  const chatWindow = document.querySelector('.chat-widget-window');
  if (!chatWindow) return;
  
  // Type assertion to HTMLElement to use style property
  const chatWindowElement = chatWindow as HTMLElement;
  const currentDisplay = getComputedStyle(chatWindowElement).display;
  chatWindowElement.style.display = currentDisplay === 'none' ? 'flex' : 'none';
};

/**
 * Auto-resize the textarea based on content
 */
export const autoResize = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  
  // Update send button disabled state
  const sendButton = textarea.form?.querySelector('.chat-widget-send-button') as HTMLButtonElement;
  if (sendButton) {
    // We'll get isLoading from the global scope in the runtime environment
    const isLoading = (window as any).__chatWidgetIsLoading || false;
    sendButton.disabled = textarea.value.trim() === '' || isLoading;
  }
};

/**
 * Create a message element
 */
export const createMessageElement = (sender: 'user' | 'agent', text: string) => {
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

/**
 * Show typing indicator
 */
export const showTypingIndicator = () => {
  const messagesContainer = document.querySelector('.chat-widget-messages');
  if (!messagesContainer) return;
  
  // Get the typingText from window if available, otherwise use default
  const typingText = (window as any).__chatWidgetConfig?.typingText || 'Typing';
  
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-widget-typing';
  typingIndicator.innerHTML = `${typingText}<div class="chat-widget-typing-dots"><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div><div class="chat-widget-typing-dot"></div></div>`;
  typingIndicator.id = 'typing-indicator';
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

/**
 * Hide typing indicator
 */
export const hideTypingIndicator = () => {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
};

/**
 * Process message text to handle formatting
 */
export const processMessageText = (text: string) => {
  // Basic processing for links, code blocks, and lists
  let processed = text
    // Convert URLs to links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    // Process code blocks
    .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre>$1</pre>')
    // Process inline code
    .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
    // Add line breaks
    .replace(/\\n/g, '<br />');
  
  return processed;
};
