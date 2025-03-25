
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Message, WebhookResponse } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ChatContextProps {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
  initialWebhookUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialWebhookUrl = "",
  position = "bottom-right",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Failed to parse stored messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Toggle the chat open/closed state
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Reset the chat messages
  const resetChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  }, []);

  // Helper function to ensure timestamp is a number
  const normalizeTimestamp = (timestamp: string | number): number => {
    if (typeof timestamp === 'number') {
      return timestamp;
    }
    
    // Try to parse the timestamp as a Date
    try {
      return new Date(timestamp).getTime();
    } catch (e) {
      console.error("Failed to parse timestamp:", timestamp);
      return Date.now(); // Fallback to current time if parsing fails
    }
  };

  // Send a message to the webhook
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      
      if (!webhookUrl) {
        toast.error("Webhook URL is not set");
        return;
      }

      // Create a new user message
      const userMessage: Message = {
        id: uuidv4(),
        text,
        sender: "user",
        timestamp: Date.now(),
      };

      // Update the local state with the user message
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Send the message to the webhook
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            messages: messages,
          }),
        });

        if (!response.ok) {
          throw new Error(`Webhook request failed with status ${response.status}`);
        }

        const data: WebhookResponse = await response.json();

        if (data.status === "error") {
          throw new Error(data.error || "Unknown error from webhook");
        }

        // Update messages with the response from the webhook
        setMessages((prev) => {
          // Process incoming messages to ensure they have the correct format
          const processedMessages = Array.isArray(data.messages) 
            ? data.messages.map(msg => ({
                ...msg,
                id: msg.id || uuidv4(), // Ensure there's an ID
                timestamp: normalizeTimestamp(msg.timestamp) // Normalize timestamp
              }))
            : [];
            
          // Filter out any messages from the webhook that we already have
          const newMessages = processedMessages.filter(
            (msg) => !prev.some((prevMsg) => prevMsg.id === msg.id)
          );
          
          return [...prev, ...newMessages];
        });
      } catch (error) {
        console.error("Error sending message to webhook:", error);
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, webhookUrl]
  );

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        webhookUrl,
        setWebhookUrl,
        toggleChat,
        sendMessage,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
