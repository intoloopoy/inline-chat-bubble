
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
  // Generate the embed URL
  const embedUrl = `${baseUrl}/embed/chat?id=${encodeURIComponent(chatId)}`;
  
  // Generate the iframe code with the onload function directly in the iframe tag
  return `<iframe
  id="chat-widget-${chatId}"
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write; fullscreen"
  allowfullscreen
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
  onload="(function(iframe) {
    if (!iframe) return;

    const chatIframe = iframe;
    const originalStyles = {
      width: chatIframe.style.width || '${width}', 
      height: chatIframe.style.height || '${height}'
    };

    window.addEventListener('message', ({ data }) => {
      if (!data || !chatIframe) return;

      if (data.type === 'IFRAME_REQUEST_FULLSCREEN') {
        Object.assign(chatIframe.style, {
          position: 'fixed', 
          top: '0', 
          left: '0', 
          width: '100%', 
          height: '100%', 
          zIndex: '9999',
          borderRadius: '0',
        });
      } 
      else if (data.type === 'IFRAME_EXIT_FULLSCREEN') {
        Object.assign(chatIframe.style, {
          position: '', 
          top: '', 
          left: '', 
          width: originalStyles.width, 
          height: originalStyles.height, 
          zIndex: '',
          borderRadius: '8px',
        });
      }
    });
  })(this)"
></iframe>`;
};
