
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Book, BookOpen, Plus, Share, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children, end }) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-recipe-mint/50 text-foreground/80"
      )}
    >
      {icon}
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-64 h-full bg-white border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <Link to="/">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 11h.01M11 15h.01M16 16h.01M11 11h.01" />
              <path d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" />
              <path d="M10 2v8.5a.5.5 0 01-.5.5H3" />
              <path d="M7 16a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            RecipeHub
          </h1>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Collaborate on recipes</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink to="/" icon={<Home size={18} />} end>
          Home
        </SidebarLink>
        
        <SidebarLink to="/public-recipes" icon={<BookOpen size={18} />}>
          Public Recipes
        </SidebarLink>
        
        {isAuthenticated && (
          <>
            <SidebarLink to="/my-recipes" icon={<Book size={18} />}>
              My Recipes
            </SidebarLink>
            
            <SidebarLink to="/shared-with-me" icon={<Share size={18} />}>
              Shared With Me
            </SidebarLink>
            
            <SidebarLink to="/create-recipe" icon={<Plus size={18} />}>
              Create Recipe
            </SidebarLink>
            
            <SidebarLink to="/account" icon={<User size={18} />}>
              Account
            </SidebarLink>
          </>
        )}
      </nav>
      
      {!isAuthenticated && (
        <div className="p-4 border-t border-border">
          <div className="bg-recipe-mint/20 rounded-lg p-3">
            <h3 className="font-medium">Want to create recipes?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Log in to create and share your own recipes
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to="/login" 
                className="btn-recipe-secondary text-center text-sm"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="btn-recipe-primary text-center text-sm"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
