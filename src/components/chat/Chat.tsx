
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import ChatHeader from "./ChatHeader";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";

interface ChatProps {
  title?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  isInline?: boolean;
  bubbleClassName?: string;
  containerClassName?: string;
  width?: string;
  height?: string;
}

const Chat: React.FC<ChatProps> = ({
  title = "Chat",
  position = "bottom-right",
  isInline = false,
  bubbleClassName,
  containerClassName,
  width = "100%",
  height = "500px",
}) => {
  const { isOpen, toggleChat } = useChatContext();

  const positionClasses = {
    "bottom-right": "right-4 bottom-4",
    "bottom-left": "left-4 bottom-4",
    "top-right": "right-4 top-4",
    "top-left": "left-4 top-4",
  };

  // Inline chat container has different styling
  const containerStyles = isInline
    ? {
        position: "relative",
        width,
        height,
      }
    : {
        position: "fixed",
        width: "350px",
        height: "500px",
      };

  return (
    <>
      {/* Chat bubble button */}
      {!isOpen && !isInline && (
        <Button
          onClick={toggleChat}
          className={cn(
            "fixed z-50 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-105 transition-transform duration-200",
            positionClasses[position],
            bubbleClassName
          )}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat container */}
      {(isOpen || isInline) && (
        <div
          style={containerStyles as React.CSSProperties}
          className={cn(
            "chat-container chat-glass rounded-lg",
            !isInline && "md:w-[400px] md:h-[600px]",
            !isInline && positionClasses[position],
            containerClassName
          )}
        >
          <ChatHeader title={title} showClose={!isInline} />
          <MessagesContainer />
          <MessageInput />
        </div>
      )}
    </>
  );
};

export default Chat;
