
export const generateEmbedScript = (webhookUrl: string) => {
  return `
<!-- Chat Widget Script -->
<script>
(function() {
  // Create container
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  document.body.appendChild(container);
  
  // Load styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://yourdomain.com/widget.css';
  document.head.appendChild(link);
  
  // Load script
  const script = document.createElement('script');
  script.src = 'https://yourdomain.com/widget.js';
  script.onload = function() {
    // Initialize chat with webhook
    window.chatWidget.init({
      webhook: "${webhookUrl}",
      position: "bottom-right"
    });
  };
  document.body.appendChild(script);
})();
</script>
`;
};
