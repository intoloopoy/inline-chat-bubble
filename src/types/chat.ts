
export interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: number;
}

export interface WebhookResponse {
  messages: Message[];
  status: "success" | "error";
  error?: string;
}
