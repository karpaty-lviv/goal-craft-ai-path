import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Target, Trophy, CheckCircle, Plus, Trash2, Sparkles, Edit3, Save, X, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  createdAt: string;
  targetDate: string;
  category: string;
  isCompleted: boolean;
  plan: string[];
}

const GoalDetail = () => {
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [completedPlanSteps, setCompletedPlanSteps] = useState<Set<number>>(new Set());
  const [newStep, setNewStep] = useState("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editingStepText, setEditingStepText] = useState("");
  const [editGoalTitle, setEditGoalTitle] = useState("");
  const [editGoalDescription, setEditGoalDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const goals: Goal[] = JSON.parse(savedGoals);
      const foundGoal = goals.find(g => g.id === id);
      if (foundGoal) {
        setGoal(foundGoal);
        // Initialize completed steps based on progress
        const completedCount = Math.floor((foundGoal.progress / 100) * foundGoal.plan.length);
        const completed = new Set<number>();
        for (let i = 0; i < completedCount; i++) {
          completed.add(i);
        }
        setCompletedPlanSteps(completed);
      }
    }
  }, [id]);

  const generateAIPlan = async (title: string, description: string, existingSteps: string[]): Promise<string[]> => {
    // Simulate AI planning with realistic plans based on goal type
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    const keywords = (title + " " + description).toLowerCase();
    let aiSteps: string[] = [];
    
    if (keywords.includes("learn") || keywords.includes("study") || keywords.includes("course")) {
      aiSteps = [
        "Research and gather learning resources",
        "Create a structured study schedule",
        "Start with fundamentals and basics",
        "Practice with hands-on exercises",
        "Build sample projects to apply knowledge",
        "Join communities or find study partners",
        "Take assessments to track progress",
        "Complete advanced topics and specialization"
      ];
    } else if (keywords.includes("fitness") || keywords.includes("exercise") || keywords.includes("run") || keywords.includes("gym")) {
      aiSteps = [
        "Assess current fitness level",
        "Set up a workout schedule",
        "Start with beginner-friendly exercises",
        "Track daily activities and progress",
        "Gradually increase intensity",
        "Focus on proper nutrition",
        "Monitor health metrics",
        "Celebrate milestones and adjust goals"
      ];
    } else if (keywords.includes("business") || keywords.includes("startup") || keywords.includes("company")) {
      aiSteps = [
        "Conduct market research",
        "Develop a business plan",
        "Secure initial funding or investment",
        "Build a minimum viable product",
        "Test with early customers",
        "Iterate based on feedback",
        "Scale operations and marketing",
        "Establish sustainable growth"
      ];
    } else if (keywords.includes("save") || keywords.includes("money") || keywords.includes("financial")) {
      aiSteps = [
        "Analyze current spending habits",
        "Create a detailed budget plan",
        "Set up automatic savings",
        "Cut unnecessary expenses",
        "Find additional income sources",
        "Track progress monthly",
        "Adjust strategy as needed",
        "Reach your financial target"
      ];
    } else {
      aiSteps = [
        "Break down the goal into smaller tasks",
        "Research best practices and strategies",
        "Create a timeline and milestones",
        "Start with the most important tasks",
        "Track progress regularly",
        "Adjust approach based on results",
        "Stay consistent with daily actions",
        "Complete the goal and celebrate"
      ];
    }

    // Filter out steps that are too similar to existing ones
    const newSteps = aiSteps.filter(aiStep => 
      !existingSteps.some(existingStep => 
        existingStep.toLowerCase().includes(aiStep.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
        aiStep.toLowerCase().includes(existingStep.toLowerCase().split(' ').slice(0, 3).join(' '))
      )
    );

    return [...existingSteps, ...newSteps];
  };

  const updateGoalInStorage = (updatedGoal: Goal) => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const goals: Goal[] = JSON.parse(savedGoals);
      const updatedGoals = goals.map(g => g.id === id ? updatedGoal : g);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      setGoal(updatedGoal);
    }
  };

  const handleEditGoal = () => {
    if (!goal) return;
    setEditGoalTitle(goal.title);
    setEditGoalDescription(goal.description);
    setEditingGoal(true);
  };

  const handleSaveGoal = () => {
    if (!goal || !editGoalTitle.trim() || !editGoalDescription.trim()) return;
    
    const updatedGoal = {
      ...goal,
      title: editGoalTitle.trim(),
      description: editGoalDescription.trim()
    };
    
    updateGoalInStorage(updatedGoal);
    setEditingGoal(false);
    
    toast({
      title: "Goal updated",
      description: "Goal details have been saved",
    });
  };

  const handleCancelEditGoal = () => {
    setEditingGoal(false);
    setEditGoalTitle("");
    setEditGoalDescription("");
  };

  const handleEditStep = (stepIndex: number, stepText: string) => {
    setEditingStep(stepIndex);
    setEditingStepText(stepText);
  };

  const handleSaveStep = () => {
    if (!goal || editingStep === null || !editingStepText.trim()) return;
    
    const updatedPlan = [...goal.plan];
    updatedPlan[editingStep] = editingStepText.trim();
    
    const updatedGoal = {
      ...goal,
      plan: updatedPlan
    };
    
    updateGoalInStorage(updatedGoal);
    setEditingStep(null);
    setEditingStepText("");
    
    toast({
      title: "Step updated",
      description: "Step has been saved",
    });
  };

  const handleCancelEditStep = () => {
    setEditingStep(null);
    setEditingStepText("");
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !goal) return;
    
    const items = Array.from(goal.plan);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update completed steps indices
    const newCompletedSteps = new Set<number>();
    completedPlanSteps.forEach(completedIndex => {
      // Find where this step moved to
      let newIndex = completedIndex;
      if (completedIndex === result.source.index) {
        newIndex = result.destination.index;
      } else if (completedIndex > result.source.index && completedIndex <= result.destination.index) {
        newIndex = completedIndex - 1;
      } else if (completedIndex < result.source.index && completedIndex >= result.destination.index) {
        newIndex = completedIndex + 1;
      }
      newCompletedSteps.add(newIndex);
    });
    
    setCompletedPlanSteps(newCompletedSteps);
    
    const updatedGoal = {
      ...goal,
      plan: items,
      completedSteps: newCompletedSteps.size
    };
    
    updateGoalInStorage(updatedGoal);
    
    toast({
      title: "Steps reordered",
      description: "Step order has been updated",
    });
  };

  const handleStepToggle = (stepIndex: number, isChecked: boolean) => {
    const newCompletedSteps = new Set(completedPlanSteps);
    
    if (isChecked) {
      newCompletedSteps.add(stepIndex);
    } else {
      newCompletedSteps.delete(stepIndex);
    }
    
    setCompletedPlanSteps(newCompletedSteps);
    
    if (goal) {
      const newProgress = goal.plan.length === 0 ? 0 : Math.round((newCompletedSteps.size / goal.plan.length) * 100);
      const updatedGoal = {
        ...goal,
        progress: newProgress,
        completedSteps: newCompletedSteps.size,
        totalSteps: goal.plan.length,
        isCompleted: newProgress === 100 && goal.plan.length > 0
      };
      
      updateGoalInStorage(updatedGoal);
      
      if (newProgress === 100 && !goal.isCompleted && goal.plan.length > 0) {
        toast({
          title: "🎉 Congratulations!",
          description: "You've completed your goal! Great work!",
        });
      }
    }
  };

  const handleAddStep = () => {
    if (!newStep.trim() || !goal) return;
    
    const updatedPlan = [...goal.plan, newStep.trim()];
    const updatedGoal = {
      ...goal,
      plan: updatedPlan,
      totalSteps: updatedPlan.length
    };
    
    updateGoalInStorage(updatedGoal);
    setNewStep("");
    
    toast({
      title: "Step added",
      description: "New step has been added to your plan",
    });
  };

  const handleDeleteStep = (stepIndex: number) => {
    if (!goal) return;
    
    const updatedPlan = goal.plan.filter((_, index) => index !== stepIndex);
    const newCompletedSteps = new Set<number>();
    
    // Adjust completed steps indices
    completedPlanSteps.forEach(completedIndex => {
      if (completedIndex < stepIndex) {
        newCompletedSteps.add(completedIndex);
      } else if (completedIndex > stepIndex) {
        newCompletedSteps.add(completedIndex - 1);
      }
    });
    
    setCompletedPlanSteps(newCompletedSteps);
    
    const newProgress = updatedPlan.length === 0 ? 0 : Math.round((newCompletedSteps.size / updatedPlan.length) * 100);
    const updatedGoal = {
      ...goal,
      plan: updatedPlan,
      totalSteps: updatedPlan.length,
      progress: newProgress,
      completedSteps: newCompletedSteps.size,
      isCompleted: newProgress === 100 && updatedPlan.length > 0
    };
    
    updateGoalInStorage(updatedGoal);
    
    toast({
      title: "Step deleted",
      description: "Step has been removed from your plan",
    });
  };

  const handleGenerateAIPlan = async () => {
    if (!goal) return;
    
    setIsGeneratingPlan(true);
    try {
      const newPlan = await generateAIPlan(goal.title, goal.description, goal.plan);
      
      // Reset completed steps for new plan
      const newCompletedSteps = new Set<number>();
      completedPlanSteps.forEach(completedIndex => {
        if (completedIndex < goal.plan.length) {
          newCompletedSteps.add(completedIndex);
        }
      });
      
      setCompletedPlanSteps(newCompletedSteps);
      
      const newProgress = newPlan.length === 0 ? 0 : Math.round((newCompletedSteps.size / newPlan.length) * 100);
      const updatedGoal = {
        ...goal,
        plan: newPlan,
        totalSteps: newPlan.length,
        progress: newProgress,
        completedSteps: newCompletedSteps.size,
        isCompleted: newProgress === 100 && newPlan.length > 0
      };
      
      updateGoalInStorage(updatedGoal);
      
      toast({
        title: "AI Plan Generated!",
        description: `AI has added ${newPlan.length - goal.plan.length} new steps to your plan`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Goal not found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilTarget = Math.ceil(
    (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Goal Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {editingGoal ? (
                <div className="space-y-4">
                  <div>
                    <Input
                      value={editGoalTitle}
                      onChange={(e) => setEditGoalTitle(e.target.value)}
                      className="text-3xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent"
                      placeholder="Goal title..."
                    />
                  </div>
                  <div>
                    <Textarea
                      value={editGoalDescription}
                      onChange={(e) => setEditGoalDescription(e.target.value)}
                      className="text-lg border-none p-0 focus-visible:ring-0 bg-transparent resize-none"
                      placeholder="Goal description..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveGoal} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEditGoal} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
                    <Button onClick={handleEditGoal} variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-lg text-gray-600">{goal.description}</p>
                </div>
              )}
            </div>
            {goal.isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <Trophy className="h-8 w-8" />
                <span className="text-lg font-semibold">Completed!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Badge variant="outline">{goal.category}</Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Target: {new Date(goal.targetDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : 'Overdue'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-bold text-blue-600">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{completedPlanSteps.size}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{goal.plan.length - completedPlanSteps.size}</div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-2">Created</div>
                  <div className="font-medium">{new Date(goal.createdAt).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan Steps */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Action Plan
                  </CardTitle>
                  <Button
                    onClick={handleGenerateAIPlan}
                    disabled={isGeneratingPlan}
                    variant="outline"
                    size="sm"
                  >
                    {isGeneratingPlan ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Plan
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {goal.plan.map((step, index) => (
                            <Draggable key={index} draggableId={index.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex items-start gap-3 p-4 rounded-lg border transition-all mb-3 ${
                                    completedPlanSteps.has(index)
                                      ? 'bg-green-50 border-green-200'
                                      : 'bg-white border-gray-200 hover:border-blue-300'
                                  } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                >
                                  <div {...provided.dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <Checkbox
                                    checked={completedPlanSteps.has(index)}
                                    onCheckedChange={(checked) => handleStepToggle(index, checked as boolean)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-500">
                                        Step {index + 1}
                                      </span>
                                      {completedPlanSteps.has(index) && (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                    </div>
                                    {editingStep === index ? (
                                      <div className="space-y-2">
                                        <Input
                                          value={editingStepText}
                                          onChange={(e) => setEditingStepText(e.target.value)}
                                          onKeyPress={(e) => e.key === 'Enter' && handleSaveStep()}
                                          className="text-sm"
                                        />
                                        <div className="flex gap-2">
                                          <Button onClick={handleSaveStep} size="sm" variant="outline">
                                            <Save className="h-3 w-3 mr-1" />
                                            Save
                                          </Button>
                                          <Button onClick={handleCancelEditStep} size="sm" variant="ghost">
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <p className={`flex-1 ${
                                          completedPlanSteps.has(index)
                                            ? 'text-green-700 line-through'
                                            : 'text-gray-900'
                                        }`}>
                                          {step}
                                        </p>
                                        <Button
                                          onClick={() => handleEditStep(index, step)}
                                          variant="ghost"
                                          size="sm"
                                          className="text-gray-500 hover:text-gray-700"
                                        >
                                          <Edit3 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    onClick={() => handleDeleteStep(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Add New Step */}
                  <div className="flex gap-2 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                    <Input
                      placeholder="Add a new step to your plan..."
                      value={newStep}
                      onChange={(e) => setNewStep(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddStep()}
                      className="flex-1"
                    />
                    <Button onClick={handleAddStep} disabled={!newStep.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {goal.plan.length === 0 && (
                    <div className="text-center py-8">
                      <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Start planning your goal</h3>
                      <p className="text-gray-600 mb-4">
                        Add your own steps or use AI to generate a personalized plan
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoalDetail;
