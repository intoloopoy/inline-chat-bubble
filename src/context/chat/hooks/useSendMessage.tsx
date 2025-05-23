import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Message, WebhookResponse } from "@/types/chat";
import { parseWebhookResponse, processMessage, isDuplicateMessage } from "../utils";

/**
 * Hook to handle sending messages to a webhook
 */
export const useSendMessage = (
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  webhookUrl: string,
  threadId: string | undefined,
  setThreadId: React.Dispatch<React.SetStateAction<string | undefined>>,
  chatTitle: string
) => {
  const [isLoading, setIsLoading] = useState(false);

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
        // Extract URL parameters from iframe if present
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        const moduleId = urlParams.get('module_id');
        
        // Get parent page URL if in an iframe, otherwise use current URL
        let pageUrl = window.location.href;
        try {
          if (window.parent !== window) {
            // We're in an iframe
            pageUrl = document.referrer || window.parent.location.href;
          }
        } catch (e) {
          // If we can't access parent due to cross-origin restrictions, fallback to referrer
          pageUrl = document.referrer || window.location.href;
        }
        
        // Create the request payload
        const payload: Record<string, any> = {
          message: text,
          messages: messages,  // Send all messages for context
          chat_title: chatTitle,
          page_url: pageUrl, // Use parent page URL when embedded
          ...(threadId && { thread_id: threadId }),
          ...(userId && { user_id: userId }),
          ...(moduleId && { module_id: moduleId }),
        };
        
        console.log("Sending message to webhook:", webhookUrl);
        console.log("Payload:", payload);
        
        // Send the message to the webhook with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout
        
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
        
        try {
          // Parse the webhook response
          const data: WebhookResponse = parseWebhookResponse(responseText);
          console.log("Webhook response parsed:", data);

          if (data.status === "error") {
            throw new Error(data.error || "Unknown error from webhook");
          }

          // Ensure messages array exists in response
          if (!Array.isArray(data.messages) || data.messages.length === 0) {
            // Handle case where no messages are returned but response is valid
            const fallbackMessage: Message = {
              id: uuidv4(),
              text: "I've received your message but there was no response content.",
              sender: "agent",
              timestamp: Date.now(),
            };
            
            setMessages(prev => [...prev, fallbackMessage]);
            console.warn("No messages in webhook response, using fallback");
            return;
          }
          
          // Update messages with the response from the webhook
          setMessages((prev) => {
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
        } catch (parseError) {
          // If we can't parse the response, create a fallback message
          console.error("Error parsing webhook response:", parseError);
          
          const fallbackMessage: Message = {
            id: uuidv4(),
            text: "I received your message, but had trouble processing the response.",
            sender: "agent",
            timestamp: Date.now(),
          };
          
          setMessages(prev => [...prev, fallbackMessage]);
        }
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
    [webhookUrl, threadId, setMessages, setThreadId, chatTitle, messages]
  );

  return {
    isLoading,
    sendMessage
  };
};
