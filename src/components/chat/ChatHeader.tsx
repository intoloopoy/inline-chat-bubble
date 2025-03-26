
import React from "react";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/context/ChatContext";

interface ChatHeaderProps {
  showClose?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  primaryColor?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  showClose = true,
  isFullscreen = false,
  onToggleFullscreen,
  primaryColor,
}) => {
  const { toggleChat, chatTitle } = useChatContext();

  return (
    <div 
      className="flex items-center justify-between p-3 bg-primary text-primary-foreground"
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      <h3 className="text-sm font-medium">{chatTitle}</h3>
      <div className="flex items-center gap-1">
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="h-7 w-7 rounded-full text-primary-foreground opacity-70 hover:opacity-100 hover:bg-white/10"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
        {showClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleChat}
            className="h-7 w-7 rounded-full text-primary-foreground opacity-70 hover:opacity-100 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
