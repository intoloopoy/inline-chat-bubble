
import React from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { processHtmlContent } from "@/context/chat/utils";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const messageText = processHtmlContent(message.text);
  
  // Format timestamp using the user's locale without AM/PM
  const formattedTime = new Date(message.timestamp).toLocaleTimeString(
    navigator.language, 
    { hour: '2-digit', minute: '2-digit', hour12: false }
  );
  
  return (
    <div
      className={cn(
        "flex mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          isUser ? "chat-user-bubble" : "chat-bubble"
        )}
        style={isUser ? { 
          backgroundColor: "var(--chat-primary-color, hsl(var(--primary)))",
          color: "white"
        } : undefined}
      >
        <div className="flex flex-col">
          {isUser ? (
            <span className="text-sm">{messageText}</span>
          ) : (
            <div 
              className="text-sm chat-message-content"
              dangerouslySetInnerHTML={{ __html: messageText }} 
            />
          )}
          <span className={cn(
            "text-xs mt-1",
            isUser ? "text-white/70" : "text-gray-500" // Updated for better contrast
          )}>
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
