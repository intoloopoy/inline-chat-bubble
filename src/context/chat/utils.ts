
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types/chat";

/**
 * Ensure timestamp is a number
 */
export const normalizeTimestamp = (timestamp: string | number | undefined): number => {
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

/**
 * Process a single message to ensure it has the correct format
 */
export const processMessage = (msg: any): Message => {
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

/**
 * Check if a message is a duplicate
 */
export const isDuplicateMessage = (newMsg: Message, existingMessages: Message[]): boolean => {
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

/**
 * Parse webhook response text
 */
export const parseWebhookResponse = (responseText: string) => {
  // Try different parsing strategies in sequence
  const parsingStrategies = [
    // Strategy 1: Direct parsing
    () => JSON.parse(responseText),
    
    // Strategy 2: Handle HTML content by properly escaping it
    () => {
      const preparedText = responseText.replace(/("text"\s*:\s*")([^"]*?)(")/g, (match, p1, p2, p3) => {
        const escapedContent = p2
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\\"/g, '\\\\"');
        return p1 + escapedContent + p3;
      });
      return JSON.parse(preparedText);
    },
    
    // Strategy 3: Replace quotes and special characters 
    () => {
      const sanitizedText = responseText
        .replace(/[""]/g, '"') // Replace curly quotes with straight quotes
        .replace(/[\u0000-\u0019]+/g, " "); // Replace control characters with spaces
      return JSON.parse(sanitizedText);
    },
    
    // Strategy 4: Handle newlines and line breaks
    () => {
      const sanitizedText = responseText
        .replace(/[\n\r]+/g, ' ')
        .replace(/\\n/g, '\\\\n')
        .replace(/\\r/g, '\\\\r');
      return JSON.parse(sanitizedText);
    },
    
    // Strategy 5: Aggressive cleaning - handle all problematic cases
    () => {
      // Remove all whitespace between tokens, normalize quotes
      const stripped = responseText
        .replace(/\s+/g, ' ')
        .replace(/([^\\])?'([^']*)'([^\\])?/g, '$1"$2"$3')
        .trim();
      return JSON.parse(stripped);
    }
  ];
  
  // Try each strategy in turn
  for (let i = 0; i < parsingStrategies.length; i++) {
    try {
      const result = parsingStrategies[i]();
      console.log(`Webhook response parsed with strategy ${i+1}`);
      return result;
    } catch (error) {
      console.warn(`Strategy ${i+1} failed:`, error);
      // Continue to the next strategy
    }
  }
  
  // If all strategies fail, create a fallback response
  console.error("All parsing strategies failed for webhook response");
  return {
    status: "success",
    messages: [{
      id: uuidv4(),
      text: "I received your message, but had trouble processing the response.",
      sender: "agent",
      timestamp: Date.now()
    }]
  };
};

/**
 * Process HTML content in message
 * This will sanitize HTML and ensure it's displayed properly
 */
export const processHtmlContent = (text: string): string => {
  if (!text) return "";
  
  // Check if the text contains HTML tags
  if (/<\/?[a-z][\s\S]*>/i.test(text)) {
    // Keep the HTML structure but ensure it's safe
    // In a real app, you might want to use a library like DOMPurify
    return text
      // Fix common HTML issues
      .replace(/\s+/g, " ")
      // Ensure proper spacing for list items to render correctly
      .replace(/<\/li>\s*<li>/g, "</li><li>")
      // Ensure proper structure for ordered and unordered lists
      .replace(/<ol>/g, '<ol class="list-decimal pl-5 my-2">')
      .replace(/<ul>/g, '<ul class="list-disc pl-5 my-2">')
      // Add proper styling for paragraphs
      .replace(/<p>/g, '<p class="mb-2">')
      .trim();
  }
  
  return text;
};
