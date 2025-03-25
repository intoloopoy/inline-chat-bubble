
export const generateEmbedScript = (webhookUrl: string, options = {}) => {
  const defaultOptions = {
    position: "bottom-right",
    isInline: false,
    targetSelector: null,
    width: "100%",
    height: "500px"
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  const optionsString = JSON.stringify(mergedOptions);
  
  return `
<!-- Chat Widget Script -->
<script>
(function() {
  // Create container
  ${mergedOptions.isInline && mergedOptions.targetSelector ? `
  // Inline mode - inject into target element
  const targetElement = document.querySelector('${mergedOptions.targetSelector}');
  if (!targetElement) {
    console.error('Chat widget target element not found:', '${mergedOptions.targetSelector}');
    return;
  }
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  container.style.width = '${mergedOptions.width}';
  container.style.height = '${mergedOptions.height}';
  targetElement.appendChild(container);
  ` : `
  // Fixed position mode
  const container = document.createElement('div');
  container.id = 'chat-widget-container';
  document.body.appendChild(container);
  `}
  
  // Load styles
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://yourdomain.com/widget.css';
  document.head.appendChild(link);
  
  // Load script
  const script = document.createElement('script');
  script.src = 'https://yourdomain.com/widget.js';
  script.onload = function() {
    // Initialize chat with webhook and options
    window.chatWidget.init({
      webhook: "${webhookUrl}",
      ...${optionsString}
    });
  };
  document.body.appendChild(script);
})();
</script>
`;
};
