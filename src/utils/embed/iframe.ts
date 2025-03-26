
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
  
  // Generate the iframe code
  return `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="clipboard-write"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
></iframe>`;
};
