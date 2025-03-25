
import { useState, useEffect } from "react";
import { loadThreadIdFromStorage, saveThreadIdToStorage } from "../storage";

/**
 * Hook to manage thread ID with localStorage persistence
 */
export const useThreadId = () => {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  
  // Load threadId from localStorage on component mount
  useEffect(() => {
    setThreadId(loadThreadIdFromStorage());
  }, []);
  
  // Save threadId to localStorage whenever it changes
  useEffect(() => {
    saveThreadIdToStorage(threadId);
  }, [threadId]);

  return {
    threadId,
    setThreadId
  };
};
