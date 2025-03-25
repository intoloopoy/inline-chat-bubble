
import { useState, useCallback } from "react";
import { clearChatStorage } from "./storage";
import { ChatContextProps } from "./types";
import { useMessages, useThreadId, useChatToggle, useSendMessage } from "./hooks";

export const useChat = (initialWebhookUrl: string = ""): ChatContextProps => {
  const { messages, setMessages } = useMessages();
  const { threadId, setThreadId } = useThreadId();
  const { isOpen, toggleChat } = useChatToggle();
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  
  const { isLoading, sendMessage } = useSendMessage(
    messages, 
    setMessages, 
    webhookUrl, 
    threadId, 
    setThreadId
  );

  // Reset the chat messages and thread ID
  const resetChat = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    clearChatStorage();
  }, [setMessages, setThreadId]);

  return {
    messages,
    isOpen,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    toggleChat,
    sendMessage,
    resetChat,
  };
};
