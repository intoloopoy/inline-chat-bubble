
/**
 * Generate CSS styles for the embedded chat widget
 */
export const generateEmbedStyles = (config: {
  isInline: boolean;
  positionClass: string;
  width: string;
  height: string;
}) => {
  return `
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
  `;
};
