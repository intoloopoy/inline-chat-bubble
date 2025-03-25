
import React from "react";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { X, Minimize2, Settings, Maximize2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChatHeaderProps {
  showClose?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  showClose = true,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const { 
    toggleChat, 
    webhookUrl, 
    setWebhookUrl, 
    resetChat,
    chatTitle,
    setChatTitle,
    inputPlaceholder,
    setInputPlaceholder,
    emptyStateText,
    setEmptyStateText
  } = useChatContext();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
      <h3 className="text-lg font-medium">{chatTitle}</h3>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure the chat widget
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chat-title">Chat Title</Label>
                <Input
                  id="chat-title"
                  value={chatTitle}
                  onChange={(e) => setChatTitle(e.target.value)}
                  placeholder="Support Chat"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="input-placeholder">Input Placeholder</Label>
                <Input
                  id="input-placeholder"
                  value={inputPlaceholder}
                  onChange={(e) => setInputPlaceholder(e.target.value)}
                  placeholder="Type a message..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="empty-state-text">Empty State Text</Label>
                <Input
                  id="empty-state-text"
                  value={emptyStateText}
                  onChange={(e) => setEmptyStateText(e.target.value)}
                  placeholder="Send a message to start chatting"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input
                  id="webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                />
              </div>
              <Button 
                variant="destructive" 
                onClick={resetChat}
                className="w-full"
              >
                Clear Chat History
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
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
