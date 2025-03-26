
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Chat Embed Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              Create and manage embeddable chat widgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access the admin dashboard to create, configure and manage your chat widgets.
              Generate embed codes to add chats to any website.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin">Go to Admin Panel</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Chat Settings</CardTitle>
            <CardDescription>
              Configure and customize your chat widgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Create multiple chat widgets with different configurations.
              Customize titles, placeholder text, and webhook endpoints.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/chats">Manage Chat Settings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
