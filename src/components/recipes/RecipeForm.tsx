
import React, { useState } from "react";
import { Recipe } from "../../types";
import { X, Plus, Timer } from "lucide-react";

interface RecipeFormProps {
  initialRecipe?: Partial<Recipe>;
  onSubmit: (recipe: Partial<Recipe>) => void;
  isReadOnly?: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  initialRecipe = {},
  onSubmit,
  isReadOnly = false
}) => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    title: "",
    description: "",
    servings: 4,
    ingredients: [],
    steps: [],
    tags: [],
    isPublic: false,
    ...initialRecipe
  });

  const [newIngredient, setNewIngredient] = useState({ name: "", quantity: 0, unit: "" });
  const [newStep, setNewStep] = useState({ description: "", timerMinutes: undefined });
  const [newTag, setNewTag] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setRecipe({
      ...recipe,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRecipe({
      ...recipe,
      [name]: checked
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name.trim() === "") return;
    
    setRecipe({
      ...recipe,
      ingredients: [
        ...(recipe.ingredients || []),
        { ...newIngredient, id: `ing-${Date.now()}` }
      ]
    });
    setNewIngredient({ name: "", quantity: 0, unit: "" });
  };

  const handleRemoveIngredient = (id: string) => {
    setRecipe({
      ...recipe,
      ingredients: (recipe.ingredients || []).filter(ing => ing.id !== id)
    });
  };

  const handleAddStep = () => {
    if (newStep.description.trim() === "") return;
    
    setRecipe({
      ...recipe,
      steps: [
        ...(recipe.steps || []),
        { ...newStep, id: `step-${Date.now()}` }
      ]
    });
    setNewStep({ description: "", timerMinutes: undefined });
  };

  const handleRemoveStep = (id: string) => {
    setRecipe({
      ...recipe,
      steps: (recipe.steps || []).filter(step => step.id !== id)
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() === "" || (recipe.tags || []).includes(newTag)) return;
    
    setRecipe({
      ...recipe,
      tags: [...(recipe.tags || []), newTag]
    });
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setRecipe({
      ...recipe,
      tags: (recipe.tags || []).filter(t => t !== tag)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(recipe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Recipe Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          disabled={isReadOnly}
          className="w-full rounded-md border border-input p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={recipe.description}
          onChange={handleChange}
          disabled={isReadOnly}
          className="w-full rounded-md border border-input p-2"
        />
      </div>

      <div>
        <label htmlFor="servings" className="block text-sm font-medium mb-1">
          Default Servings
        </label>
        <input
          type="number"
          id="servings"
          name="servings"
          min="1"
          value={recipe.servings}
          onChange={handleChange}
          disabled={isReadOnly}
          className="w-full rounded-md border border-input p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.tags?.map((tag) => (
            <div key={tag} className="bg-recipe-mint px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {tag}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary hover:text-primary-foreground ml-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {!isReadOnly && (
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 rounded-l-md border border-input p-2"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-recipe-primary rounded-l-none"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ingredients</label>
        <div className="space-y-2 mb-4">
          {recipe.ingredients?.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center gap-2 bg-muted/50 rounded p-2">
              <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
              <span>{ingredient.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveIngredient(ingredient.id)}
                disabled={isReadOnly}
                className={`ml-auto ${isReadOnly ? 'hidden' : ''}`}
              >
                <X size={16} className="text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
        {!isReadOnly && (
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Ingredient"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              className="col-span-3 md:col-span-1 rounded-md border border-input p-2"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newIngredient.quantity || ""}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: Number(e.target.value) })}
              className="rounded-md border border-input p-2"
              min="0"
            />
            <div className="flex">
              <input
                type="text"
                placeholder="Unit"
                value={newIngredient.unit}
                onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                className="flex-1 rounded-l-md border border-input p-2"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="btn-recipe-primary rounded-l-none"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Steps</label>
        <div className="space-y-3 mb-4">
          {recipe.steps?.map((step, index) => (
            <div key={step.id} className="flex gap-4 bg-muted/50 rounded p-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p>{step.description}</p>
                {step.timerMinutes && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Timer size={14} />
                    <span>{step.timerMinutes} min timer</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStep(step.id)}
                disabled={isReadOnly}
                className={`flex-shrink-0 ${isReadOnly ? 'hidden' : ''}`}
              >
                <X size={16} className="text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>
        {!isReadOnly && (
          <div className="space-y-2">
            <textarea
              placeholder="Step description"
              value={newStep.description}
              onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
              className="w-full rounded-md border border-input p-2"
              rows={2}
            />
            <div className="flex gap-2">
              <div className="flex items-center">
                <Timer size={16} className="mr-1" />
                <span className="text-sm">Timer:</span>
              </div>
              <input
                type="number"
                placeholder="Minutes (optional)"
                value={newStep.timerMinutes || ""}
                onChange={(e) => 
                  setNewStep({ 
                    ...newStep, 
                    timerMinutes: e.target.value ? Number(e.target.value) : undefined 
                  })
                }
                className="flex-1 rounded-md border border-input p-2"
                min="0"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="btn-recipe-primary"
              >
                Add Step
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={recipe.isPublic}
          onChange={handleCheckboxChange}
          disabled={isReadOnly}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isPublic" className="ml-2 text-sm">
          Make this recipe public (anyone can view)
        </label>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end">
          <button type="submit" className="btn-recipe-primary">
            {initialRecipe.id ? "Update Recipe" : "Create Recipe"}
          </button>
        </div>
      )}
    </form>
  );
};
