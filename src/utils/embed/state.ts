
/**
 * Set the loading state for the chat widget
 */
export const setLoadingState = (isLoading: boolean) => {
  (window as any).__chatWidgetIsLoading = isLoading;
  
  const sendButton = document.querySelector('.chat-widget-send-button');
  if (sendButton) {
    const textarea = document.querySelector('.chat-widget-textarea') as HTMLTextAreaElement;
    (sendButton as HTMLButtonElement).disabled = isLoading || (textarea && textarea.value.trim() === '');
    
    if (isLoading) {
      (sendButton as HTMLButtonElement).innerHTML = '<div class="chat-widget-loader"></div>';
    } else {
      (sendButton as HTMLButtonElement).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
    }
  }
};
