
import { useState, useCallback } from "react";
import { clearChatStorage } from "./storage";
import { ChatContextProps } from "./types";
import { useMessages, useThreadId, useChatToggle, useSendMessage } from "./hooks";

export const useChat = (
  initialWebhookUrl: string = "",
  initialChatTitle: string = "Support Chat",
  initialInputPlaceholder: string = "Type a message...",
  initialEmptyStateText: string = "Send a message to start chatting"
): ChatContextProps => {
  const { messages, setMessages } = useMessages();
  const { threadId, setThreadId } = useThreadId();
  const { isOpen, toggleChat } = useChatToggle();
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [chatTitle, setChatTitle] = useState(initialChatTitle);
  const [inputPlaceholder, setInputPlaceholder] = useState(initialInputPlaceholder);
  const [emptyStateText, setEmptyStateText] = useState(initialEmptyStateText);
  
  const { isLoading, sendMessage } = useSendMessage(
    messages, 
    setMessages, 
    webhookUrl, 
    threadId, 
    setThreadId,
    chatTitle
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
    emptyStateText,
    setWebhookUrl,
    setChatTitle,
    setInputPlaceholder,
    setEmptyStateText,
    toggleChat,
    sendMessage,
    resetChat,
  };
};
