
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
  const normalizeTimestamp = (timestamp: string | number | undefined): number => {
    if (typeof timestamp === 'number') {
      return timestamp;
    }
    
    if (!timestamp) {
      return Date.now(); // If no timestamp provided, use current time
    }
    
    // Handle malformed timestamp strings by removing extra quotes
    if (typeof timestamp === 'string') {
      // Remove any extra quotes that might be in the string
      const cleanTimestamp = timestamp.replace(/^["'](.*)["']$/, '$1');
      
      // Try to parse the timestamp as a number first
      const parsed = parseInt(cleanTimestamp, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
      
      // Try to parse as date if it's not a simple number
      try {
        return new Date(cleanTimestamp).getTime();
      } catch (e) {
        console.error("Failed to parse timestamp:", timestamp);
        return Date.now(); // Fallback to current time if parsing fails
      }
    }
    
    return Date.now(); // Final fallback
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

        // Get the response body as text first
        const responseText = await response.text();
        
        // Try to parse the JSON
        let data: WebhookResponse;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse webhook response:", responseText);
          throw new Error("Invalid JSON response from webhook");
        }

        if (data.status === "error") {
          throw new Error(data.error || "Unknown error from webhook");
        }

        console.log("Webhook response:", data);

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
          
          if (newMessages.length === 0) {
            console.warn("No new messages received from webhook");
          } else {
            console.log("New messages added:", newMessages);
          }
          
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
