
export interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: number;
  thread_id?: string; // Added to accommodate webhook responses that include thread_id
}

export interface WebhookResponse {
  messages: Message[];
  status: "success" | "error";
  error?: string;
}
