
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";

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

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progressColor = goal.isCompleted ? "bg-green-500" : goal.progress > 50 ? "bg-blue-500" : "bg-gray-400";
  const badgeVariant = goal.isCompleted ? "default" : "secondary";

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {goal.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {goal.description}
            </p>
          </div>
          {goal.isCompleted && (
            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 ml-2" />
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <Badge variant={badgeVariant} className="text-xs">
            {goal.category}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(goal.targetDate).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                {goal.completedSteps}/{goal.totalSteps} steps
              </span>
              <span className="text-xs text-gray-500">
                {goal.totalSteps - goal.completedSteps} remaining
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Link to={`/goal/${goal.id}`}>
            <Button className="w-full" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
