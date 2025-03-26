
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Maximize2, Minimize2, X } from "lucide-react";
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
  inputPlaceholder?: string;
}

const Chat: React.FC<ChatProps> = ({
  position = "bottom-right",
  isInline = false,
  bubbleClassName,
  containerClassName,
  width = "100%",
  height = "500px",
}) => {
  const { isOpen, toggleChat, chatTitle } = useChatContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  
  useEffect(() => {
    // Check if we're in an iframe
    const inIframe = window !== window.parent;
    setIsIframe(inIframe);
  }, []);

  const toggleFullscreen = () => {
    if (isIframe) {
      try {
        // If in iframe, communicate with parent window
        if (!isFullscreen) {
          // Request fullscreen from parent
          window.parent.postMessage({ type: "IFRAME_REQUEST_FULLSCREEN" }, "*");
        } else {
          // Exit fullscreen
          window.parent.postMessage({ type: "IFRAME_EXIT_FULLSCREEN" }, "*");
        }
      } catch (error) {
        // Silent fail if postMessage is not available
      }
    }
    
    // Toggle the fullscreen state
    setIsFullscreen(prev => !prev);
  };

  // Calculate container styles based on mode and fullscreen state
  const containerStyles = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 100,
        borderRadius: 0,
      }
    : isInline
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
            !isInline && !isFullscreen && "md:w-[400px] md:h-[600px]",
            !isInline && !isFullscreen && positionClasses[position],
            isFullscreen && "rounded-none",
            containerClassName
          )}
        >
          <ChatHeader 
            showClose={!isInline} 
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
          <MessagesContainer />
          <MessageInput />
        </div>
      )}
    </>
  );
};

// Position class mapping
const positionClasses = {
  "bottom-right": "right-4 bottom-4",
  "bottom-left": "left-4 bottom-4",
  "top-right": "right-4 top-4",
  "top-left": "left-4 top-4",
};

export default Chat;
