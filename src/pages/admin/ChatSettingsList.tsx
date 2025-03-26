
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllChatSettings, ChatSettings } from "@/utils/supabase";
import { Settings, Copy, ExternalLink, Trash2 } from "lucide-react";
import { generateIframeEmbedCode } from "@/utils/embedChat";
import { useToast } from "@/hooks/use-toast";

const ChatSettingsList: React.FC = () => {
  const [chatSettings, setChatSettings] = useState<ChatSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchChatSettings = async () => {
      setLoading(true);
      const settings = await getAllChatSettings();
      setChatSettings(settings);
      setLoading(false);
    };

    fetchChatSettings();
  }, []);

  const copyEmbedCode = (chatId: string, width: string, height: string, primaryColor: string) => {
    // Get the base URL without any path
    const url = window.location.origin;
    const embedCode = generateIframeEmbedCode(url, chatId, width, height, primaryColor);
    
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        toast({
          title: "Embed code copied",
          description: "The embed code has been copied to your clipboard",
        });
      })
      .catch((err) => {
        console.error("Failed to copy embed code:", err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the embed code to clipboard",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chat Settings</h1>
        <Button asChild>
          <Link to="/admin/chats/new">Create New Chat</Link>
        </Button>
      </div>
      
      {loading ? (
        <p>Loading chat settings...</p>
      ) : chatSettings.length === 0 ? (
        <div className="bg-muted p-6 text-center rounded-lg">
          <p className="text-muted-foreground">No chats created yet</p>
          <Button asChild className="mt-4">
            <Link to="/admin/chats/new">Create your first chat</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chatSettings.map((chat) => (
            <Card key={chat.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {chat.name}
                  {chat.primary_color && (
                    <div 
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: chat.primary_color || "#2563eb" }}
                    ></div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Chat Title:</span> {chat.chat_title}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Webhook URL:</span> {chat.webhook_url}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {chat.width} × {chat.height}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Color:</span> 
                    <code className="bg-muted px-1 rounded text-xs">{chat.primary_color || "#2563eb"}</code>
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ backgroundColor: chat.primary_color || "#2563eb" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <div className="flex w-full justify-between space-x-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to={`/admin/chats/${chat.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => copyEmbedCode(chat.id, chat.width, chat.height, chat.primary_color || "#2563eb")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Embed
                  </Button>
                </div>
                <div className="flex w-full justify-between space-x-2">
                  <Button variant="secondary" asChild className="flex-1">
                    <Link to={`/embed/chat?id=${chat.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSettingsList;
