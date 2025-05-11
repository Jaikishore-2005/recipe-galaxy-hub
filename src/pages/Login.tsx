
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <Link 
          to="/" 
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to RecipeHub</h2>
            <p className="text-muted-foreground">
              Log in to create and share recipes
            </p>
          </div>
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input p-2"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input p-2"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-recipe-primary py-2"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Demo credentials */}
      <div className="mt-6 text-center bg-recipe-mint/30 p-4 rounded-lg">
        <p className="text-sm mb-2">
          <strong>Demo credentials:</strong>
        </p>
        <p className="text-sm">
          Email: <span className="font-mono">demo@example.com</span>
        </p>
        <p className="text-sm">
          Password: <span className="font-mono">password123</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
