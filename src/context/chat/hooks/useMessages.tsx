
import { useState, useEffect } from "react";
import { Message } from "@/types/chat";
import { loadMessagesFromStorage, saveMessagesToStorage } from "../storage";

/**
 * Hook to manage chat messages with localStorage persistence
 */
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    setMessages(loadMessagesFromStorage());
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  return {
    messages,
    setMessages
  };
};
