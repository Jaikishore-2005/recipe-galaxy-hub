
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { RecipeProvider } from "./contexts/RecipeContext";

// Pages
import Home from "./pages/Home";
import MyRecipes from "./pages/MyRecipes";
import SharedWithMe from "./pages/SharedWithMe";
import PublicRecipes from "./pages/PublicRecipes";
import CreateEditRecipe from "./pages/CreateEditRecipe";
import ViewRecipe from "./pages/ViewRecipe";
import ShareRecipe from "./pages/ShareRecipe";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RecipeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/my-recipes" element={<MainLayout><MyRecipes /></MainLayout>} />
              <Route path="/shared-with-me" element={<MainLayout><SharedWithMe /></MainLayout>} />
              <Route path="/public-recipes" element={<MainLayout><PublicRecipes /></MainLayout>} />
              <Route path="/create-recipe" element={<MainLayout><CreateEditRecipe /></MainLayout>} />
              <Route path="/recipes/:recipeId" element={<MainLayout><ViewRecipe /></MainLayout>} />
              <Route path="/recipes/:recipeId/edit" element={<MainLayout><CreateEditRecipe /></MainLayout>} />
              <Route path="/recipes/:recipeId/share" element={<MainLayout><ShareRecipe /></MainLayout>} />
              <Route path="/account" element={<MainLayout><Account /></MainLayout>} />
              <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
              <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
              <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RecipeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
