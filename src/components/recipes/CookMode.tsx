
import React, { useState, useEffect } from "react";
import { Recipe, Step } from "../../types";
import { Timer, ChevronLeft, ChevronRight } from "lucide-react";

interface CookModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookMode: React.FC<CookModeProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const currentStep: Step | undefined = recipe.steps[currentStepIndex];
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      // Play sound or show notification
      new Audio("/notification.mp3").play().catch(err => console.log("Audio playback error:", err));
      alert("Timer completed!");
    }
    
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);
  
  const startTimer = () => {
    if (currentStep?.timerMinutes) {
      setTimeRemaining(currentStep.timerMinutes * 60);
      setTimerRunning(true);
    }
  };
  
  const stopTimer = () => {
    setTimerRunning(false);
  };
  
  const goToNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setTimerRunning(false);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setTimerRunning(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (!currentStep) {
    return <div>No steps found in this recipe.</div>;
  }
  
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="btn-recipe-secondary"
        >
          Exit Cook Mode
        </button>
        <h2 className="text-lg font-semibold">{recipe.title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Servings: {recipe.servings}</span>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 md:p-10 flex flex-col items-center">
        {/* Progress indicator */}
        <div className="w-full max-w-3xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStepIndex + 1} of {recipe.steps.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevStep}
                disabled={currentStepIndex === 0}
                className="p-1 rounded disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextStep}
                disabled={currentStepIndex === recipe.steps.length - 1}
                className="p-1 rounded disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="h-2 bg-muted rounded overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${((currentStepIndex + 1) / recipe.steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Current step */}
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              {currentStepIndex + 1}
            </div>
            <div className="flex-1">
              <p className="text-lg">{currentStep.description}</p>
              
              {currentStep.timerMinutes && (
                <div className="mt-4 flex items-center">
                  <Timer size={18} className="mr-2" />
                  <span>Timer: {currentStep.timerMinutes} minute{currentStep.timerMinutes !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Timer section */}
          {currentStep.timerMinutes && (
            <div className="mt-6 pt-4 border-t">
              {timerRunning ? (
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-mono mb-3">{formatTime(timeRemaining)}</div>
                  <button 
                    onClick={stopTimer}
                    className="btn-recipe-secondary"
                  >
                    Stop Timer
                  </button>
                </div>
              ) : (
                <button 
                  onClick={startTimer}
                  className="w-full btn-recipe-primary flex items-center justify-center gap-2 py-3"
                >
                  <Timer size={18} />
                  {timeRemaining > 0 
                    ? `Resume Timer (${formatTime(timeRemaining)})`
                    : `Start ${currentStep.timerMinutes} Minute Timer`}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="w-full max-w-3xl flex justify-between">
          <button
            onClick={goToPrevStep}
            disabled={currentStepIndex === 0}
            className="btn-recipe-secondary flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
            Previous Step
          </button>
          
          <button
            onClick={goToNextStep}
            disabled={currentStepIndex === recipe.steps.length - 1}
            className="btn-recipe-primary flex items-center gap-1 disabled:opacity-50"
          >
            Next Step
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
