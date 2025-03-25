
import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const MessageInput: React.FC = () => {
  const { sendMessage, isLoading } = useChatContext();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize the textarea as the user types
  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t p-3 bg-background"
    >
      <div className="relative flex-grow">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message..."
          className="w-full resize-none overflow-y-auto rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[40px] max-h-[120px]"
          disabled={isLoading}
          rows={1}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        disabled={!message.trim() || isLoading}
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default MessageInput;
