
import React, { useEffect, useState } from "react";
import { ChatProvider } from "@/context/ChatContext";
import Chat from "@/components/chat/Chat";
import { useSearchParams } from "react-router-dom";
import { getChatSettings } from "@/utils/supabase";
import { Loader2 } from "lucide-react";

const EmbedChat = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    webhookUrl: "",
    chatTitle: "Support Chat",
    inputPlaceholder: "Type a message...",
    emptyStateText: "Send a message to start chatting",
    instanceId: `chat_${Math.random().toString(36).substring(2, 15)}`
  });

  useEffect(() => {
    const loadChatSettings = async () => {
      setLoading(true);
      
      // Get chat ID from URL parameters
      const chatId = searchParams.get("id");
      
      if (!chatId) {
        setError("Chat ID is required");
        setLoading(false);
        return;
      }
      
      try {
        // Fetch chat settings from database
        const settings = await getChatSettings(chatId);
        
        if (!settings) {
          setError("Chat settings not found");
          setLoading(false);
          return;
        }
        
        // Update configuration with settings from database
        setConfig({
          webhookUrl: settings.webhook_url,
          chatTitle: settings.chat_title,
          inputPlaceholder: settings.input_placeholder,
          emptyStateText: settings.empty_state_text,
          instanceId: `chat_${chatId}`
        });
        
        // Add message to inform parent frame that the chat is ready
        window.parent.postMessage({ type: "CHAT_READY", instanceId: `chat_${chatId}` }, "*");
      } catch (err) {
        console.error("Error loading chat settings:", err);
        setError("Failed to load chat settings");
      } finally {
        setLoading(false);
      }
    };
    
    loadChatSettings();
  }, [searchParams]);

  // Apply iframe-specific styles
  useEffect(() => {
    // Reset body styles
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    
    // Add a class to the body for iframe-specific styles
    document.body.classList.add("iframe-embed");
    
    return () => {
      document.body.classList.remove("iframe-embed");
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-transparent">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-transparent text-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-transparent">
      <ChatProvider
        initialWebhookUrl={config.webhookUrl}
        initialChatTitle={config.chatTitle}
        initialInputPlaceholder={config.inputPlaceholder}
        initialEmptyStateText={config.emptyStateText}
      >
        <Chat
          isInline={true}
          width="100%"
          height="100%"
          containerClassName="rounded-none shadow-none"
        />
      </ChatProvider>
    </div>
  );
};

export default EmbedChat;
