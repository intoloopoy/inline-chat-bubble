
import React, { useEffect, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import MessageBubble from "./MessageBubble";
import { Loader2 } from "lucide-react";

const MessagesContainer: React.FC = () => {
  const { messages, isLoading, emptyStateText } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p>{emptyStateText}</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-2">
              <div className="chat-bubble flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessagesContainer;
