
import { Message } from "@/types/chat";

// Base storage keys
const BASE_MESSAGES_STORAGE_KEY = "chatMessages";
const BASE_THREAD_ID_STORAGE_KEY = "chatThreadId";

/**
 * Get chat-specific storage key
 */
const getChatStorageKey = (baseKey: string): string => {
  // Check if we're in an embedded chat and extract the chat ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get('id');
  
  // If chatId exists, use it to create a unique storage key
  return chatId ? `${baseKey}_${chatId}` : baseKey;
};

/**
 * Load messages from localStorage for the specific chat
 */
export const loadMessagesFromStorage = (): Message[] => {
  const storageKey = getChatStorageKey(BASE_MESSAGES_STORAGE_KEY);
  const storedMessages = localStorage.getItem(storageKey);
  
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
 * Save messages to localStorage for the specific chat
 */
export const saveMessagesToStorage = (messages: Message[]): void => {
  const storageKey = getChatStorageKey(BASE_MESSAGES_STORAGE_KEY);
  localStorage.setItem(storageKey, JSON.stringify(messages));
};

/**
 * Load thread ID from localStorage for the specific chat
 */
export const loadThreadIdFromStorage = (): string | undefined => {
  const storageKey = getChatStorageKey(BASE_THREAD_ID_STORAGE_KEY);
  return localStorage.getItem(storageKey) || undefined;
};

/**
 * Save thread ID to localStorage for the specific chat
 */
export const saveThreadIdToStorage = (threadId: string | undefined): void => {
  const storageKey = getChatStorageKey(BASE_THREAD_ID_STORAGE_KEY);
  if (threadId) {
    localStorage.setItem(storageKey, threadId);
  } else {
    localStorage.removeItem(storageKey);
  }
};

/**
 * Clear chat storage for the specific chat
 */
export const clearChatStorage = (): void => {
  const messagesKey = getChatStorageKey(BASE_MESSAGES_STORAGE_KEY);
  const threadIdKey = getChatStorageKey(BASE_THREAD_ID_STORAGE_KEY);
  
  localStorage.removeItem(messagesKey);
  localStorage.removeItem(threadIdKey);
};
