
import { useState, useCallback } from "react";

/**
 * Hook to manage chat open/closed state
 */
export const useChatToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the chat open/closed state
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    toggleChat
  };
};
