
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createChatSettings, getChatSettings, updateChatSettings, deleteChatSettings, ChatSettings } from "@/utils/supabase";
import { Copy, Loader2 } from "lucide-react";
import { generateIframeEmbedCode } from "@/utils/embedChat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ChatSettingsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id) && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [embedCode, setEmbedCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<ChatSettings, 'id' | 'created_at'>>({
    name: "",
    chat_title: "Support Chat",
    webhook_url: "",
    input_placeholder: "Type a message...",
    empty_state_text: "Send a message to start chatting",
    width: "100%",
    height: "500px",
  });

  useEffect(() => {
    const loadChatSettings = async () => {
      if (!isEditMode || !id) return;
      
      setLoading(true);
      try {
        const settings = await getChatSettings(id);
        if (settings) {
          setFormData({
            name: settings.name,
            chat_title: settings.chat_title,
            webhook_url: settings.webhook_url,
            input_placeholder: settings.input_placeholder,
            empty_state_text: settings.empty_state_text,
            width: settings.width,
            height: settings.height,
          });
          
          // Generate embed code for existing chat
          const url = window.location.origin;
          const code = generateIframeEmbedCode(url, settings.id, settings.width, settings.height);
          setEmbedCode(code);
        } else {
          toast({
            title: "Error",
            description: "Chat settings not found. The ID may be invalid.",
            variant: "destructive",
          });
          navigate("/admin/chats");
        }
      } catch (error) {
        console.error("Error loading chat settings:", error);
        toast({
          title: "Error",
          description: "Failed to load chat settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadChatSettings();
  }, [id, isEditMode, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditMode) {
        // Update existing chat settings
        const success = await updateChatSettings(id, formData);
        if (success) {
          toast({
            title: "Success",
            description: "Chat settings updated successfully",
          });
        } else {
          throw new Error("Failed to update chat settings");
        }
      } else {
        // Create new chat settings
        const newId = await createChatSettings(formData);
        if (newId) {
          toast({
            title: "Success",
            description: "Chat settings created successfully",
          });
          navigate(`/admin/chats/${newId}`);
        } else {
          throw new Error("Failed to create chat settings");
        }
      }
    } catch (error) {
      console.error("Error saving chat settings:", error);
      toast({
        title: "Error",
        description: "Failed to save chat settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) return;
    
    if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      setSaving(true);
      try {
        const success = await deleteChatSettings(id);
        if (success) {
          toast({
            title: "Success",
            description: "Chat settings deleted successfully",
          });
          navigate("/admin/chats");
        } else {
          throw new Error("Failed to delete chat settings");
        }
      } catch (error) {
        console.error("Error deleting chat settings:", error);
        toast({
          title: "Error",
          description: "Failed to delete chat settings",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }
  };

  const copyEmbedCode = () => {
    if (!embedCode) return;
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edit Chat Settings" : "Create New Chat"}
        </h1>
        
        {isEditMode && (
          <Button variant="destructive" onClick={handleDelete} disabled={saving}>
            Delete Chat
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Chat Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Chat Name (Admin Only)</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Support Chat"
                required
              />
              <p className="text-sm text-muted-foreground">
                This name is only shown in the admin panel
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chat_title">Chat Title</Label>
              <Input
                id="chat_title"
                name="chat_title"
                value={formData.chat_title}
                onChange={handleChange}
                placeholder="Support Chat"
                required
              />
              <p className="text-sm text-muted-foreground">
                This title appears at the top of the chat widget
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook_url">Webhook URL</Label>
              <Input
                id="webhook_url"
                name="webhook_url"
                value={formData.webhook_url}
                onChange={handleChange}
                placeholder="https://example.com/api/chat"
                required
              />
              <p className="text-sm text-muted-foreground">
                The endpoint that will process chat messages
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="100%"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="500px"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="input_placeholder">Input Placeholder</Label>
              <Input
                id="input_placeholder"
                name="input_placeholder"
                value={formData.input_placeholder}
                onChange={handleChange}
                placeholder="Type a message..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="empty_state_text">Empty State Text</Label>
              <Textarea
                id="empty_state_text"
                name="empty_state_text"
                value={formData.empty_state_text}
                onChange={handleChange}
                placeholder="Send a message to start chatting"
                rows={2}
              />
              <p className="text-sm text-muted-foreground">
                Text shown when the chat is empty
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/chats")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Update" : "Create"} Chat
            </Button>
          </CardFooter>
        </Card>
      </form>
      
      {isEditMode && embedCode && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>How to embed this chat</AlertTitle>
              <AlertDescription>
                Copy the code below and paste it into your website's HTML to embed this chat.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 relative">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap text-sm">
                {embedCode}
              </pre>
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyEmbedCode}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatSettingsForm;
