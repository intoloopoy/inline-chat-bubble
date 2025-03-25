
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isInline, setIsInline] = useState(false);
  const [targetSelector, setTargetSelector] = useState("#chat-container");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("500px");
  const [position, setPosition] = useState("bottom-right");
  
  const handleCopy = () => {
    const options = {
      position,
      isInline,
      targetSelector: isInline ? targetSelector : null,
      width,
      height
    };
    
    const script = generateEmbedScript(webhookUrl, options);
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="demo">Fixed Position Demo</TabsTrigger>
              <TabsTrigger value="inline">Inline Demo</TabsTrigger>
              <TabsTrigger value="embed">Get Embed Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="p-6 rounded-lg bg-card shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Try the Fixed Position Demo</h2>
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
            
            <TabsContent value="inline" className="p-6 rounded-lg bg-card shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Try the Inline Demo</h2>
                <p className="text-muted-foreground mb-4">
                  This demo shows how the chat widget can be embedded inline within your content,
                  perfect for dedicated chat sections on your website.
                </p>
              </div>
              
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="inlineWebhook">Webhook URL for demo</Label>
                  <Input
                    id="inlineWebhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 border rounded-lg bg-muted/10">
                    <h3 className="text-lg font-medium mb-3">Article Content</h3>
                    <p className="mb-3">
                      This is an example of website content that could appear alongside the chat.
                      The chat is embedded inline and integrated with the rest of your site's content.
                    </p>
                    <p>
                      You can customize the width and height of the inline chat to fit your design needs.
                    </p>
                  </div>
                  
                  <ChatProvider initialWebhookUrl={webhookUrl}>
                    <Chat 
                      isInline={true} 
                      width="100%" 
                      height="300px"
                      title="Support Chat"
                    />
                  </ChatProvider>
                  
                  <div className="md:col-span-2 p-4 border rounded-lg bg-muted/10 mt-4">
                    <h3 className="text-lg font-medium mb-3">More Content After Chat</h3>
                    <p>
                      You can place additional content below the chat to create a seamless experience
                      for your users. The chat widget adapts to its container size, making it
                      fully responsive.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="embed" className="p-6 rounded-lg bg-card shadow-md">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Embed in Your Website</h2>
                <p className="text-muted-foreground mb-4">
                  Add the following code to your website to embed the chat widget.
                  Configure your options below.
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="embedType" className="mb-2 block">Embed Type</Label>
                    <Select 
                      value={isInline ? "inline" : "fixed"} 
                      onValueChange={(value) => setIsInline(value === "inline")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select embed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Position</SelectItem>
                        <SelectItem value="inline">Inline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {!isInline && (
                    <div>
                      <Label htmlFor="position" className="mb-2 block">Position</Label>
                      <Select 
                        value={position} 
                        onValueChange={setPosition}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {isInline && (
                    <>
                      <div>
                        <Label htmlFor="targetSelector" className="mb-2 block">Target Selector</Label>
                        <Input
                          id="targetSelector"
                          value={targetSelector}
                          onChange={(e) => setTargetSelector(e.target.value)}
                          placeholder="#chat-container"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          CSS selector where chat will be inserted
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="width" className="mb-2 block">Width</Label>
                        <Input
                          id="width"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="100%"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="height" className="mb-2 block">Height</Label>
                        <Input
                          id="height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="500px"
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="relative mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[300px] text-sm">
                    {generateEmbedScript(webhookUrl, {
                      position,
                      isInline,
                      targetSelector: isInline ? targetSelector : null,
                      width,
                      height
                    })}
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
                  {isInline 
                    ? "This script will inject the chat widget into the specified element on your page."
                    : "This script will load the chat widget in a fixed position on your page."}
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
