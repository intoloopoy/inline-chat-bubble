
import React from "react";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Maximize2 } from "lucide-react";

interface ChatHeaderProps {
  showClose?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isInline?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  showClose = true,
  isFullscreen = false,
  onToggleFullscreen,
  isInline = false
}) => {
  const { 
    toggleChat,
    chatTitle
  } = useChatContext();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
      <h3 className="text-lg font-medium">{chatTitle}</h3>
      <div className="flex items-center space-x-2">
        {onToggleFullscreen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleFullscreen} 
            className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
          </Button>
        )}
        
        {showClose && (
          <>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
