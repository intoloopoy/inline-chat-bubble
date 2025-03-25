
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
  // Try first approach - with robust handling for multi-line text
  try {
    // Use a more robust approach for parsing JSON with newlines
    // First replace any literal \n with \\n and handle other escaping issues
    const preparedText = responseText
      .replace(/\n/g, "\\n") // Replace literal newlines with escaped newlines
      .replace(/\r/g, "\\r") // Replace carriage returns
      .replace(/\t/g, "\\t") // Replace tabs
      .replace(/(["\s\\])([\\]+)(["\s])/g, "$1$2$2$3") // Fix any double escaping issues
      .replace(/\\/g, "\\\\") // Double escape all backslashes
      .replace(/\\\\/g, "\\") // But fix any we just double-escaped
      .replace(/"/g, '\\"') // Escape all quotes
      .replace(/\\\\"/g, '\\"'); // Fix any double-escaped quotes
          
    // Now wrap in quotes and parse
    return JSON.parse(`{"wrappedResponse":${responseText}}`).wrappedResponse;
  } catch (firstError) {
    console.error("Failed to parse with first method, trying sanitized approach:", firstError);
    
    // Try second approach - sanitize the response by replacing problematic characters
    try {
      const sanitizedText = responseText
        .replace(/[""]/g, '"') // Replace curly quotes with straight quotes
        .replace(/[\u0000-\u0019]+/g, " "); // Replace control characters with spaces
                
      return JSON.parse(sanitizedText);
    } catch (secondError) {
      console.error("Failed to parse webhook response even after sanitizing:", secondError);
      throw new Error("Invalid JSON response from webhook even after sanitizing");
    }
  }
};
