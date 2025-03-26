
/**
 * Generate an iframe embed code for the chat widget
 */
export const generateIframeEmbedCode = (
  baseUrl: string,
  chatId: string,
  width: string = "100%",
  height: string = "500px"
) => {
  // Generate the embed URL
  const embedUrl = `${baseUrl}/embed/chat?id=${encodeURIComponent(chatId)}`;
  
  // Generate the iframe code with script to handle fullscreen requests
  return `<iframe
  id="chat-widget-${chatId}"
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>
<script>
  // Handle fullscreen requests from the iframe
  window.addEventListener("message", function(event) {
    const iframe = document.getElementById("chat-widget-${chatId}");
    if (!iframe) return;

    if (event.data && event.data.type === "IFRAME_REQUEST_FULLSCREEN") {
      // Store original dimensions
      iframe.dataset.originalWidth = iframe.style.width || "${width}";
      iframe.dataset.originalHeight = iframe.style.height || "${height}";
      
      // Make iframe fullscreen
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.zIndex = "9999";
      iframe.style.borderRadius = "0";
    } 
    else if (event.data && event.data.type === "IFRAME_EXIT_FULLSCREEN") {
      // Restore original dimensions
      iframe.style.position = "";
      iframe.style.top = "";
      iframe.style.left = "";
      iframe.style.width = iframe.dataset.originalWidth || "${width}";
      iframe.style.height = iframe.dataset.originalHeight || "${height}";
      iframe.style.zIndex = "";
      iframe.style.borderRadius = "8px";
    }
  });
</script>`;
};
