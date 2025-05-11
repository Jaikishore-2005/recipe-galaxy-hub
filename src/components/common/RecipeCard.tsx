
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Recipe } from "../../types";
import { Edit, Share, ExternalLink, Clock } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, showActions = true }) => {
  const { hasPermission, currentUser } = useAuth();
  const isOwner = currentUser?.id === recipe.owner.id;
  const canEdit = hasPermission(recipe, "edit_own") || hasPermission(recipe, "edit_if_invited");
  const canInvite = hasPermission(recipe, "invite_collaborators");
  
  return (
    <div className="recipe-card group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold line-clamp-1">{recipe.title}</h3>
        {recipe.collaborators.length > 0 && (
          <div className="flex -space-x-2">
            {recipe.collaborators.slice(0, 3).map((collaborator) => (
              <div 
                key={collaborator.id}
                className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center overflow-hidden text-xs"
                title={collaborator.name}
              >
                {collaborator.avatar ? (
                  <img 
                    src={collaborator.avatar} 
                    alt={collaborator.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  collaborator.name.charAt(0)
                )}
              </div>
            ))}
            {recipe.collaborators.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs">
                +{recipe.collaborators.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {recipe.description}
      </p>
      
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          Updated {new Date(recipe.updatedAt).toLocaleDateString()}
        </span>
        <span>•</span>
        <span>{recipe.servings} servings</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {recipe.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="recipe-tag">
            {tag}
          </span>
        ))}
        {recipe.tags.length > 3 && <span className="recipe-tag">+{recipe.tags.length - 3}</span>}
      </div>
      
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/50">
        <span className="text-xs font-medium">By {recipe.owner.name}</span>
        
        <div className="flex gap-2">
          <Link 
            to={`/recipes/${recipe.id}`} 
            className="p-2 rounded hover:bg-muted transition-colors"
            title="View recipe"
          >
            <ExternalLink size={16} />
          </Link>
          
          {showActions && canEdit && (
            <Link 
              to={`/recipes/${recipe.id}/edit`} 
              className="p-2 rounded hover:bg-muted transition-colors"
              title="Edit recipe"
            >
              <Edit size={16} />
            </Link>
          )}
          
          {showActions && canInvite && (
            <Link 
              to={`/recipes/${recipe.id}/share`} 
              className="p-2 rounded hover:bg-muted transition-colors"
              title="Share recipe"
            >
              <Share size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
