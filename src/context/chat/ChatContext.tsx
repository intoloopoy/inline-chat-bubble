
import React, { createContext, useContext } from "react";
import { useChat } from "./useChat";
import { ChatContextProps, ChatProviderProps } from "./types";

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  initialWebhookUrl = "",
}) => {
  const chatContext = useChat(initialWebhookUrl);

  return (
    <ChatContext.Provider value={chatContext}>
      {children}
    </ChatContext.Provider>
  );
};
