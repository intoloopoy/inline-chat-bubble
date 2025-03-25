
import { useState, useCallback } from "react";
import { clearChatStorage } from "./storage";
import { ChatContextProps } from "./types";
import { useMessages, useThreadId, useChatToggle, useSendMessage } from "./hooks";

export const useChat = (
  initialWebhookUrl: string = "",
  initialChatTitle: string = "Support Chat",
  initialInputPlaceholder: string = "Type a message..."
): ChatContextProps => {
  const { messages, setMessages } = useMessages();
  const { threadId, setThreadId } = useThreadId();
  const { isOpen, toggleChat } = useChatToggle();
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [chatTitle, setChatTitle] = useState(initialChatTitle);
  const [inputPlaceholder, setInputPlaceholder] = useState(initialInputPlaceholder);
  
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
    chatTitle,
    inputPlaceholder,
    setWebhookUrl,
    setChatTitle,
    setInputPlaceholder,
    toggleChat,
    sendMessage,
    resetChat,
  };
};
