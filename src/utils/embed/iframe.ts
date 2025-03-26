
/**
 * Generate an iframe embed code for the chat widget
 */
export const generateIframeEmbedCode = (
  baseUrl: string,
  settings: {
    webhookUrl: string;
    chatTitle?: string;
    inputPlaceholder?: string;
    emptyStateText?: string;
    width?: string;
    height?: string;
    instanceId?: string;
  }
) => {
  // Create query parameters from settings
  const params = new URLSearchParams();
  
  if (settings.webhookUrl) {
    params.append('webhookUrl', settings.webhookUrl);
  }
  
  if (settings.chatTitle) {
    params.append('chatTitle', settings.chatTitle);
  }
  
  if (settings.inputPlaceholder) {
    params.append('inputPlaceholder', settings.inputPlaceholder);
  }
  
  if (settings.emptyStateText) {
    params.append('emptyStateText', settings.emptyStateText);
  }
  
  if (settings.instanceId) {
    params.append('instanceId', settings.instanceId);
  }
  
  // Generate the embed URL
  const embedUrl = `${baseUrl}/embed/chat?${params.toString()}`;
  
  // Generate the iframe code
  return `<iframe
  src="${embedUrl}"
  width="${settings.width || '100%'}"
  height="${settings.height || '500px'}"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>`;
};
