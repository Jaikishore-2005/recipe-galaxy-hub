
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipes } from "../contexts/RecipeContext";
import { useAuth } from "../contexts/AuthContext";
import { RecipeForm } from "../components/recipes/RecipeForm";
import { CollaborationPanel } from "../components/recipes/CollaborationPanel";
import { ArrowLeft, Edit } from "lucide-react";
import { Recipe } from "../types";

const CreateEditRecipe = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { getRecipeById, createRecipe, updateRecipe, addCollaborator, removeCollaborator } = useRecipes();
  const { isAuthenticated, hasPermission } = useAuth();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Check if editing or creating
  const isEditing = !!recipeId;
  
  useEffect(() => {
    // If editing, fetch the recipe
    if (isEditing && recipeId) {
      const fetchedRecipe = getRecipeById(recipeId);
      
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
        
        // Check if the user has permission to edit this recipe
        const canEdit = hasPermission(fetchedRecipe, "edit_own") || 
                         hasPermission(fetchedRecipe, "edit_if_invited");
        
        setIsReadOnly(!canEdit);
      } else {
        // Recipe not found, redirect to home
        navigate("/");
      }
    }
  }, [recipeId, getRecipeById, hasPermission, navigate, isEditing]);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">You need to log in</h1>
        <p className="text-muted-foreground mb-8">
          Please log in to create or edit recipes
        </p>
        <button 
          onClick={() => navigate("/login")}
          className="btn-recipe-primary"
        >
          Log In
        </button>
      </div>
    );
  }
  
  // Handle form submission
  const handleSubmit = (recipeData: Partial<Recipe>) => {
    if (isEditing && recipe) {
      updateRecipe({
        ...recipe,
        ...recipeData
      });
      navigate(`/recipes/${recipe.id}`);
    } else {
      createRecipe(recipeData as Omit<Recipe, "id" | "createdAt" | "updatedAt">);
      navigate("/my-recipes");
    }
  };
  
  const handleAddCollaborator = (collaborator: any) => {
    if (recipe) {
      addCollaborator(recipe.id, collaborator);
    }
  };
  
  const handleRemoveCollaborator = (collaboratorId: string) => {
    if (recipe) {
      removeCollaborator(recipe.id, collaboratorId);
    }
  };
  
  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing 
            ? isReadOnly ? "View Recipe" : "Edit Recipe" 
            : "Create Recipe"}
        </h1>
        
        {isReadOnly && (
          <button 
            onClick={() => setIsReadOnly(false)}
            className="btn-recipe-primary flex items-center gap-1"
            disabled={!recipe || (!hasPermission(recipe, "edit_own") && !hasPermission(recipe, "edit_if_invited"))}
          >
            <Edit size={16} />
            Edit
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecipeForm 
            initialRecipe={recipe || undefined}
            onSubmit={handleSubmit}
            isReadOnly={isReadOnly}
          />
        </div>
        
        {recipe && (
          <div>
            <CollaborationPanel 
              recipe={recipe}
              onAddCollaborator={handleAddCollaborator}
              onRemoveCollaborator={handleRemoveCollaborator}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEditRecipe;
