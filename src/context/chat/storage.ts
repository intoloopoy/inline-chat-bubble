
import { Message } from "@/types/chat";

// Local storage keys
const MESSAGES_STORAGE_KEY = "chatMessages";
const THREAD_ID_STORAGE_KEY = "chatThreadId";

/**
 * Load messages from localStorage
 */
export const loadMessagesFromStorage = (): Message[] => {
  const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
  
  if (storedMessages) {
    try {
      return JSON.parse(storedMessages);
    } catch (error) {
      console.error("Failed to parse stored messages:", error);
    }
  }
  
  return [];
};

/**
 * Save messages to localStorage
 */
export const saveMessagesToStorage = (messages: Message[]): void => {
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
};

/**
 * Load thread ID from localStorage
 */
export const loadThreadIdFromStorage = (): string | undefined => {
  return localStorage.getItem(THREAD_ID_STORAGE_KEY) || undefined;
};

/**
 * Save thread ID to localStorage
 */
export const saveThreadIdToStorage = (threadId: string | undefined): void => {
  if (threadId) {
    localStorage.setItem(THREAD_ID_STORAGE_KEY, threadId);
  }
};

/**
 * Clear chat storage
 */
export const clearChatStorage = (): void => {
  localStorage.removeItem(MESSAGES_STORAGE_KEY);
  localStorage.removeItem(THREAD_ID_STORAGE_KEY);
};
