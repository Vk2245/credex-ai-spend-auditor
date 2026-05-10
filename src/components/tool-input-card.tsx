import { UserToolSelection, PlanId, ToolId } from "@/lib/types";
import { getToolDetails, getPlanDetails } from "@/lib/pricing-data";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ToolInputCardProps {
  selection: UserToolSelection;
  updateTool: (toolId: ToolId, updates: Partial<UserToolSelection>) => void;
  removeTool: (toolId: ToolId) => void;
}

export function ToolInputCard({ selection, updateTool, removeTool }: ToolInputCardProps) {
  const toolDetails = getToolDetails(selection.toolId);
  if (!toolDetails) return null;

  const currentPlan = getPlanDetails(selection.toolId, selection.planId);

  return (
    <Card className="relative overflow-hidden border-slate-800 bg-slate-900/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200">{toolDetails.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeTool(selection.toolId)}
            className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 -mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Plan</Label>
            <Select
              value={selection.planId}
              onChange={(e) => {
                const newPlanId = e.target.value as PlanId;
                updateTool(selection.toolId, { planId: newPlanId });
              }}
              className="bg-slate-950 border-slate-800 text-slate-300"
            >
              {toolDetails.tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Seats</Label>
            <Input
              type="number"
              min={1}
              value={selection.seats}
              onChange={(e) => updateTool(selection.toolId, { seats: parseInt(e.target.value) || 1 })}
              disabled={!currentPlan?.isPerSeat}
              className="bg-slate-950 border-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs">Monthly Spend ($)</Label>
            <Input
              type="number"
              min={0}
              value={selection.monthlySpend}
              onChange={(e) => updateTool(selection.toolId, { monthlySpend: parseInt(e.target.value) || 0 })}
              className="bg-slate-950 border-slate-800 text-slate-300"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
