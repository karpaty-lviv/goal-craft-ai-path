
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: any) => void;
}

export const CreateGoalModal = ({ isOpen, onClose, onCreateGoal }: CreateGoalModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAIPlan = async (title: string, description: string): Promise<string[]> => {
    // Simulate AI planning with realistic plans based on goal type
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    const keywords = (title + " " + description).toLowerCase();
    
    if (keywords.includes("learn") || keywords.includes("study") || keywords.includes("course")) {
      return [
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
      return [
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
      return [
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
      return [
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
      return [
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category || !targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let plan: string[] = [];
    
    if (useAI) {
      setIsGenerating(true);
      try {
        plan = await generateAIPlan(title, description);
        toast({
          title: "Success!",
          description: "AI has generated a personalized plan for your goal",
        });
      } catch (error) {
        toast({
          title: "Warning",
          description: "Failed to generate AI plan. Creating goal with empty plan.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }

    const newGoal = {
      title: title.trim(),
      description: description.trim(),
      category,
      targetDate,
      progress: 0,
      totalSteps: plan.length || 0,
      completedSteps: 0,
      isCompleted: false,
      plan
    };

    onCreateGoal(newGoal);
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setTargetDate("");
    setUseAI(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Learn React Development"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what you want to achieve and why it's important to you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date *</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <Checkbox
              id="useAI"
              checked={useAI}
              onCheckedChange={(checked) => setUseAI(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="useAI" className="flex items-center gap-2 cursor-pointer">
                <Sparkles className="h-4 w-4 text-purple-600" />
                Create a plan using artificial intelligence
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                AI will analyze your goal and create a step-by-step plan to help you achieve it
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
