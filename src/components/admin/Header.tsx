
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth/AuthContext";
import { User, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 container">
        <Link to="/admin" className="font-semibold text-lg">
          Chat Embed Admin
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <>
              <div className="text-sm text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-1" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
