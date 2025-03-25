
import { Message } from "@/types/chat";

export interface ChatContextProps {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
}

export interface ChatProviderProps {
  children: React.ReactNode;
  initialWebhookUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}
