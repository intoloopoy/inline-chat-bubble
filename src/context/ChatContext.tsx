
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
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  // Load messages and threadId from localStorage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    const storedThreadId = localStorage.getItem("chatThreadId");
    
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error("Failed to parse stored messages:", error);
      }
    }
    
    if (storedThreadId) {
      setThreadId(storedThreadId);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);
  
  // Save threadId to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem("chatThreadId", threadId);
    }
  }, [threadId]);

  // Toggle the chat open/closed state
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Reset the chat messages and thread ID
  const resetChat = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatThreadId");
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

  // Process a single message to ensure it has the correct format
  const processMessage = (msg: any): Message => {
    // Create a properly formatted message
    const processedMessage: Message = {
      id: msg.id || uuidv4(), // Ensure there's an ID
      text: msg.text?.replace(/[""]/g, '"') || "", // Replace curly quotes with straight quotes
      sender: msg.sender || "agent",
      timestamp: normalizeTimestamp(msg.timestamp) // Normalize timestamp
    };
    
    // Add thread_id if it exists in the message
    if (msg.thread_id) {
      processedMessage.thread_id = msg.thread_id;
    }
    
    return processedMessage;
  };

  // Check if a message is a duplicate
  const isDuplicateMessage = (newMsg: Message, existingMessages: Message[]): boolean => {
    // First check by ID
    const idMatch = existingMessages.some(msg => msg.id === newMsg.id);
    if (idMatch) return true;
    
    // Then check by content and timestamp (within a small window)
    return existingMessages.some(msg => 
      msg.text === newMsg.text && 
      msg.sender === newMsg.sender &&
      Math.abs(msg.timestamp - newMsg.timestamp) < 5000 // 5 second window
    );
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
        // Create the request payload, including thread_id if available
        const payload = {
          message: text,
          messages: messages,
          ...(threadId && { thread_id: threadId }) // Add thread_id if it exists
        };
        
        console.log("Sending message to webhook:", webhookUrl);
        console.log("Payload including thread_id:", payload);
        
        // Send the message to the webhook
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Webhook request failed with status ${response.status}`);
        }

        // Get the response body as text first
        const responseText = await response.text();
        console.log("Raw webhook response:", responseText);
        
        // If response is empty or whitespace, show error
        if (!responseText.trim()) {
          console.error("Empty response from webhook");
          throw new Error("Empty response from webhook");
        }
        
        // Try to parse the JSON
        let data: WebhookResponse;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse webhook response:", responseText);
          // Attempt to sanitize the response by replacing curly quotes
          try {
            const sanitizedText = responseText.replace(/[""]/g, '"');
            data = JSON.parse(sanitizedText);
            console.log("Successfully parsed sanitized response:", data);
          } catch (secondError) {
            throw new Error("Invalid JSON response from webhook even after sanitizing");
          }
        }

        if (data.status === "error") {
          throw new Error(data.error || "Unknown error from webhook");
        }

        console.log("Webhook response:", data);

        // Update messages with the response from the webhook
        setMessages((prev) => {
          // Ensure messages array exists in response
          if (!Array.isArray(data.messages) || data.messages.length === 0) {
            console.warn("No messages in webhook response");
            return prev;
          }
          
          // Process each message from the webhook
          const newMessages = data.messages
            .map(processMessage)
            .filter(newMsg => !isDuplicateMessage(newMsg, prev));
          
          if (newMessages.length === 0) {
            console.warn("No new messages received from webhook");
            return prev;
          } else {
            console.log(`Adding ${newMessages.length} new messages:`, newMessages);
          }
          
          // Check for thread_id in the new messages and update state if found
          const firstMessageWithThreadId = newMessages.find(msg => msg.thread_id);
          if (firstMessageWithThreadId?.thread_id && firstMessageWithThreadId.thread_id !== threadId) {
            console.log("Found new thread_id:", firstMessageWithThreadId.thread_id);
            setThreadId(firstMessageWithThreadId.thread_id);
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
    [messages, webhookUrl, threadId]
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
