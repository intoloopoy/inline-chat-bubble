
import React, { useEffect, useState } from "react";
import { ChatProvider } from "@/context/ChatContext";
import Chat from "@/components/chat/Chat";
import { useSearchParams } from "react-router-dom";

const EmbedChat = () => {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState({
    webhookUrl: "",
    chatTitle: "Support Chat",
    inputPlaceholder: "Type a message...",
    emptyStateText: "Send a message to start chatting",
    instanceId: `chat_${Math.random().toString(36).substring(2, 15)}`
  });

  useEffect(() => {
    // Get configuration from URL parameters
    const webhookUrl = searchParams.get("webhookUrl") || "";
    const chatTitle = searchParams.get("chatTitle") || "Support Chat";
    const inputPlaceholder = searchParams.get("inputPlaceholder") || "Type a message...";
    const emptyStateText = searchParams.get("emptyStateText") || "Send a message to start chatting";
    const instanceId = searchParams.get("instanceId") || `chat_${Math.random().toString(36).substring(2, 15)}`;
    
    setConfig({
      webhookUrl,
      chatTitle,
      inputPlaceholder,
      emptyStateText,
      instanceId
    });
    
    // Add message to inform parent frame that the chat is ready
    window.parent.postMessage({ type: "CHAT_READY", instanceId }, "*");
    
    // Handle messages from parent frame
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SET_WEBHOOK_URL" && event.data.instanceId === instanceId) {
        setConfig(c => ({ ...c, webhookUrl: event.data.webhookUrl }));
      }
    };
    
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
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
