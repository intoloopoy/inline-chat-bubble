
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
  bubbleClassName?: string;
  containerClassName?: string;
}

const Chat: React.FC<ChatProps> = ({
  title = "Chat",
  position = "bottom-right",
  bubbleClassName,
  containerClassName,
}) => {
  const { isOpen, toggleChat } = useChatContext();

  const positionClasses = {
    "bottom-right": "right-4 bottom-4",
    "bottom-left": "left-4 bottom-4",
    "top-right": "right-4 top-4",
    "top-left": "left-4 top-4",
  };

  return (
    <>
      {/* Chat bubble button */}
      {!isOpen && (
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
      {isOpen && (
        <div
          className={cn(
            "chat-container chat-glass rounded-lg w-[350px] h-[500px] md:w-[400px] md:h-[600px]",
            positionClasses[position],
            containerClassName
          )}
        >
          <ChatHeader title={title} />
          <MessagesContainer />
          <MessageInput />
        </div>
      )}
    </>
  );
};

export default Chat;
