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
  }
) => {
  const positionClass = options.position || 'bottom-right';
  const isInline = options.isInline || false;
  const targetSelector = options.targetSelector || '#chat-container';
  const width = options.width || '100%';
  const height = options.height || '500px';
  const chatTitle = options.chatTitle || 'Support Chat';
  const inputPlaceholder = options.inputPlaceholder || 'Type a message...';
  
  return `<script src="https://cdn.jsdelivr.net/npm/@your-chat-library/embed@latest"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    ChatWidget.init({
      webhookUrl: "${webhookUrl}",
      position: "${positionClass}",
      isInline: ${isInline},
      ${isInline ? `targetSelector: "${targetSelector}",` : ''}
      ${isInline ? `width: "${width}",` : ''}
      ${isInline ? `height: "${height}",` : ''}
      chatTitle: "${chatTitle}",
      inputPlaceholder: "${inputPlaceholder}"
    });
  });
</script>`;
};
