
import React, { useState } from "react";
import { useRecipes } from "../contexts/RecipeContext";
import { RecipeCard } from "../components/common/RecipeCard";
import { Search } from "lucide-react";

const PublicRecipes = () => {
  const { publicRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Get all unique tags across recipes
  const allTags = Array.from(
    new Set(publicRecipes.flatMap(recipe => recipe.tags || []))
  ).sort();
  
  // Filter recipes by search query and selected tag
  const filteredRecipes = publicRecipes.filter(recipe => {
    const matchesSearch = !searchQuery ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Public Recipes</h1>
        <p className="text-muted-foreground">
          Browse through recipes shared by the community
        </p>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 pr-4 rounded-md border border-input"
          />
        </div>
        
        <div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              All
            </button>
            
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-recipe-mint hover:bg-recipe-mint/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recipes grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No recipes found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} showActions={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicRecipes;
