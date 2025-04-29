
/**
 * Generate an iframe embed code for the chat widget
 */
export const generateIframeEmbedCode = (
  baseUrl: string,
  chatId: string,
  width: string = "100%",
  height: string = "500px",
  primaryColor: string = "#2563eb"
) => {
  // Generate the embed URL with fullscreen handling integrated into the iframe URL
  const embedUrl = `${baseUrl}/embed/chat?id=${encodeURIComponent(chatId)}`;
  
  // Generate iframe code with improved Vue-compatible event handling
  return `<iframe
  id="chat-widget-${chatId}"
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
  onload="(function() {
    // Store iframe reference
    var chatIframe = document.getElementById('chat-widget-${chatId}');
    
    // Define fullscreen handlers in global scope for Vue compatibility
    window.handleChatFullscreen = function(event) {
      if (!chatIframe || !event.data) return;

      if (event.data.type === 'IFRAME_REQUEST_FULLSCREEN') {
        // Store original dimensions
        chatIframe.dataset.originalWidth = chatIframe.style.width || '${width}';
        chatIframe.dataset.originalHeight = chatIframe.style.height || '${height}';
        
        // Make iframe fullscreen
        chatIframe.style.position = 'fixed';
        chatIframe.style.top = '0';
        chatIframe.style.left = '0';
        chatIframe.style.width = '100%';
        chatIframe.style.height = '100%';
        chatIframe.style.zIndex = '9999';
        chatIframe.style.borderRadius = '0';
      } 
      else if (event.data.type === 'IFRAME_EXIT_FULLSCREEN') {
        // Restore original dimensions
        chatIframe.style.position = '';
        chatIframe.style.top = '';
        chatIframe.style.left = '';
        chatIframe.style.width = chatIframe.dataset.originalWidth || '${width}';
        chatIframe.style.height = chatIframe.dataset.originalHeight || '${height}';
        chatIframe.style.zIndex = '';
        chatIframe.style.borderRadius = '8px';
      }
    };
    
    // Add event listener using named function for Vue compatibility
    window.addEventListener('message', window.handleChatFullscreen);
  })()"
></iframe>`;
};
