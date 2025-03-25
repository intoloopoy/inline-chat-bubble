
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Message, WebhookResponse } from "@/types/chat";
import { 
  loadMessagesFromStorage, 
  saveMessagesToStorage, 
  loadThreadIdFromStorage, 
  saveThreadIdToStorage, 
  clearChatStorage 
} from "./storage";
import { 
  normalizeTimestamp, 
  processMessage, 
  isDuplicateMessage,
  parseWebhookResponse
} from "./utils";
import { ChatContextProps } from "./types";

export const useChat = (initialWebhookUrl: string = ""): ChatContextProps => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  // Load messages and threadId from localStorage on component mount
  useEffect(() => {
    setMessages(loadMessagesFromStorage());
    setThreadId(loadThreadIdFromStorage());
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);
  
  // Save threadId to localStorage whenever it changes
  useEffect(() => {
    saveThreadIdToStorage(threadId);
  }, [threadId]);

  // Toggle the chat open/closed state
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Reset the chat messages and thread ID
  const resetChat = useCallback(() => {
    setMessages([]);
    setThreadId(undefined);
    clearChatStorage();
  }, []);

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
        
        // Send the message to the webhook with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60 second timeout
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Webhook error (${response.status}):`, errorText);
          throw new Error(`Webhook request failed with status ${response.status}: ${errorText}`);
        }

        // Get the response body as text first
        const responseText = await response.text();
        console.log("Raw webhook response:", responseText);
        
        // If response is empty or whitespace, show error
        if (!responseText.trim()) {
          console.error("Empty response from webhook");
          throw new Error("Empty response from webhook");
        }
        
        // Parse the webhook response
        const data: WebhookResponse = parseWebhookResponse(responseText);

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
        
        // Provide more specific error messages based on the error type
        if (error instanceof TypeError && error.message.includes("NetworkError")) {
          toast.error("Network error. Please check your internet connection.");
        } else if (error instanceof DOMException && error.name === "AbortError") {
          toast.error("Request timed out. The webhook server took too long to respond.");
        } else if (error instanceof Error && error.message.includes("status 500")) {
          toast.error("The webhook server encountered an error. Please try again later or contact support.");
        } else if (error instanceof Error && error.message.includes("status 429")) {
          toast.error("Too many requests. Please wait a moment before trying again.");
        } else {
          toast.error(`Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        
        // Add a system message to inform the user about the error
        const errorMessage: Message = {
          id: uuidv4(),
          text: "Sorry, I couldn't process your message. Please try again or check the webhook URL.",
          sender: "agent",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, webhookUrl, threadId]
  );

  return {
    messages,
    isOpen,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    toggleChat,
    sendMessage,
    resetChat,
  };
};
