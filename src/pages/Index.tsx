
import React, { useState } from "react";
import { ChatProvider } from "@/context/ChatContext";
import Chat from "@/components/chat/Chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateEmbedScript } from "@/utils/embedChat";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const script = generateEmbedScript(webhookUrl);
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Inline Chat Widget</h1>
            <p className="text-xl text-muted-foreground">
              A beautiful, customizable chat widget that can be embedded in any website
            </p>
          </div>
          
          <Tabs defaultValue="demo">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="embed">Get Embed Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="p-6 rounded-lg bg-card shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Try the Demo</h2>
                <p className="text-muted-foreground mb-4">
                  Click the chat icon in the bottom right corner to open the chat widget.
                  Set a webhook URL in the settings to test the backend integration.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="demoWebhook">Webhook URL for demo</Label>
                  <Input
                    id="demoWebhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                  <p className="text-sm text-muted-foreground">
                    This webhook will receive your chat messages and should return responses.
                  </p>
                </div>
                
                <ChatProvider initialWebhookUrl={webhookUrl}>
                  <div className="h-96 border rounded-lg relative overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Your website content here</p>
                    </div>
                    <Chat />
                  </div>
                </ChatProvider>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="p-6 rounded-lg bg-card shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Embed in Your Website</h2>
                <p className="text-muted-foreground mb-4">
                  Add the following code to your website to embed the chat widget.
                  Make sure to set your webhook URL.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="embedWebhook">Your Webhook URL</Label>
                  <Input
                    id="embedWebhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                </div>
                
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
                    {generateEmbedScript(webhookUrl)}
                  </pre>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  This script will load the chat widget and connect to your webhook URL.
                  You can customize the position by changing the "position" parameter.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 p-6 rounded-lg bg-muted/30">
            <h2 className="text-2xl font-semibold mb-4">Webhook API</h2>
            <p className="text-muted-foreground mb-4">
              Your webhook should accept POST requests with the following JSON structure:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[200px] text-sm">
{`{
  "message": "User's message text",
  "messages": [
    {
      "id": "message-id",
      "text": "Previous message text",
      "sender": "user" | "agent",
      "timestamp": 1620000000000
    }
  ]
}`}
            </pre>
            <p className="text-muted-foreground my-4">
              And should return a response with this structure:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[200px] text-sm">
{`{
  "status": "success" | "error",
  "messages": [
    {
      "id": "response-id",
      "text": "Response message text",
      "sender": "agent",
      "timestamp": 1620000000000
    }
  ],
  "error": "Error message if status is error"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
