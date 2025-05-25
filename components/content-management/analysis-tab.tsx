import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AnalysisTabProps {
  aiScore: number;
}

export function AnalysisTab({ aiScore }: AnalysisTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">AI Moderation Score</h3>
        <div className="flex items-center gap-2">
          <Progress value={aiScore} className="h-2 w-24" />
          <span className="text-sm font-medium">{aiScore}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 border rounded-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">Toxicity</span>
            <Badge variant={aiScore > 70 ? "destructive" : "outline"}>
              {aiScore > 70 ? "High" : "Low"}
            </Badge>
          </div>
          <Progress value={aiScore} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            The content has been flagged for potentially toxic language or
            themes.
          </p>
        </div>

        <div className="p-3 border rounded-md">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-sm">Policy Violation</span>
            <Badge variant="outline">Medium</Badge>
          </div>
          <Progress value={55} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            The content may violate community guidelines regarding acceptable
            content.
          </p>
        </div>
      </div>
    </div>
  );
}
