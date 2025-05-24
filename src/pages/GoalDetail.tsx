
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, Target, Trophy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleStepToggle = (stepIndex: number, isChecked: boolean) => {
    const newCompletedSteps = new Set(completedPlanSteps);
    
    if (isChecked) {
      newCompletedSteps.add(stepIndex);
    } else {
      newCompletedSteps.delete(stepIndex);
    }
    
    setCompletedPlanSteps(newCompletedSteps);
    
    if (goal) {
      const newProgress = Math.round((newCompletedSteps.size / goal.plan.length) * 100);
      const updatedGoal = {
        ...goal,
        progress: newProgress,
        completedSteps: newCompletedSteps.size,
        isCompleted: newProgress === 100
      };
      
      // Update localStorage
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        const goals: Goal[] = JSON.parse(savedGoals);
        const updatedGoals = goals.map(g => g.id === id ? updatedGoal : g);
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        setGoal(updatedGoal);
        
        if (newProgress === 100 && !goal.isCompleted) {
          toast({
            title: "🎉 Congratulations!",
            description: "You've completed your goal! Great work!",
          });
        }
      }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{goal.title}</h1>
              <p className="text-lg text-gray-600">{goal.description}</p>
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
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Action Plan
                  {goal.plan.length === 0 && (
                    <Badge variant="outline">Custom Plan</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {goal.plan.length > 0 ? (
                  <div className="space-y-3">
                    {goal.plan.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                          completedPlanSteps.has(index)
                            ? 'bg-green-50 border-green-200'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
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
                          <p className={`${
                            completedPlanSteps.has(index)
                              ? 'text-green-700 line-through'
                              : 'text-gray-900'
                          }`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No plan yet</h3>
                    <p className="text-gray-600 mb-4">
                      This goal was created without an AI-generated plan. You can add your own steps manually.
                    </p>
                    <Button variant="outline">
                      Add Custom Steps
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoalDetail;
