
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllChatSettings, ChatSettings } from "@/utils/supabase";
import { Settings, MessageSquare, ExternalLink } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const [chatSettings, setChatSettings] = useState<ChatSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatSettings = async () => {
      setLoading(true);
      const settings = await getAllChatSettings();
      setChatSettings(settings);
      setLoading(false);
    };

    fetchChatSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button asChild>
          <Link to="/admin/chats/new">Create New Chat</Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : chatSettings.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Chats</h2>
        {loading ? (
          <p>Loading...</p>
        ) : chatSettings.length === 0 ? (
          <div className="bg-muted p-6 text-center rounded-lg">
            <p className="text-muted-foreground">No chats created yet</p>
            <Button asChild className="mt-4">
              <Link to="/admin/chats/new">Create your first chat</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chatSettings.slice(0, 6).map((chat) => (
              <Card key={chat.id}>
                <CardHeader>
                  <CardTitle>{chat.name}</CardTitle>
                  <CardDescription>Chat ID: {chat.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Title: {chat.chat_title}</div>
                    <div className="truncate">Webhook: {chat.webhook_url}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/admin/chats/${chat.id}`}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link to={`/embed/chat?id=${chat.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {chatSettings.length > 6 && (
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/admin/chats">View All Chats</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
