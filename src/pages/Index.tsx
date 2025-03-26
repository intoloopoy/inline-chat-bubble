
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
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
              <Link to={user ? "/admin" : "/auth"}>
                {user ? "Go to Admin Panel" : "Sign In to Admin Panel"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{user ? "Chat Settings" : "Create an Account"}</CardTitle>
            <CardDescription>
              {user ? "Configure and customize your chat widgets" : "Sign up to create your own chat widgets"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <p>
                Create multiple chat widgets with different configurations.
                Customize titles, placeholder text, and webhook endpoints.
              </p>
            ) : (
              <p>
                Sign up to create customizable chat widgets and embed them on your websites.
                Each user gets their own set of chat widgets.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to={user ? "/admin/chats" : "/auth?tab=signup"}>
                {user ? "Manage Chat Settings" : "Create Account"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
