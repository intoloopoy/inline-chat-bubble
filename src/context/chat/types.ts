
import { Message } from "@/types/chat";

export interface ChatContextProps {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  webhookUrl: string;
  chatTitle: string;
  inputPlaceholder: string;
  emptyStateText: string;
  setWebhookUrl: (url: string) => void;
  setChatTitle: (title: string) => void;
  setInputPlaceholder: (placeholder: string) => void;
  setEmptyStateText: (text: string) => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  initialWebhookUrl?: string;
  initialChatTitle?: string;
  initialInputPlaceholder?: string;
  initialEmptyStateText?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}
