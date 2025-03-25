
import React from "react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";
  
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
      >
        <div className="flex flex-col">
          <span className="text-sm">{message.text}</span>
          <span className={cn(
            "text-xs mt-1",
            isUser ? "text-blue-100" : "text-gray-500"
          )}>
            {format(new Date(message.timestamp), "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
