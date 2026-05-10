"use client";

import { useAuditStore } from "@/store/useAuditStore";
import { PRICING_DATA } from "@/lib/pricing-data";
import { ToolId, AIUseCase } from "@/lib/types";
import { ToolInputCard } from "./tool-input-card";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function SpendForm() {
  const {
    teamSize,
    primaryUseCase,
    tools,
    setTeamSize,
    setPrimaryUseCase,
    addTool,
    updateTool,
    removeTool,
    setCurrentStep
  } = useAuditStore();

  const availableTools = Object.values(PRICING_DATA).filter(
    (tool) => !tools.find((t) => t.toolId === tool.id)
  );

  const handleAddTool = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const toolId = e.target.value as ToolId;
    if (!toolId) return;
    
    const defaultPlan = PRICING_DATA[toolId].tiers[0].id;
    addTool(toolId, defaultPlan);
    e.target.value = ""; // Reset select
  };

  const handleAudit = () => {
    if (tools.length === 0) {
      toast.error("Please add at least one AI tool to audit.");
      return;
    }
    setCurrentStep("results");
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left">
      {/* Basic Info */}
      <Card className="border-slate-800 bg-slate-900/30">
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Team Size</Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
              className="bg-slate-950 border-slate-800 text-slate-200 text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Primary Use Case</Label>
            <Select
              value={primaryUseCase}
              onChange={(e) => setPrimaryUseCase(e.target.value as AIUseCase)}
              className="bg-slate-950 border-slate-800 text-slate-200 text-sm"
            >
              <option value="coding">Software Development (Coding)</option>
              <option value="writing">Content &amp; Writing</option>
              <option value="data">Data Analysis</option>
              <option value="research">Research &amp; Strategy</option>
              <option value="mixed">Mixed / General Purpose</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-200">Your AI Stack</h2>
          <span className="text-sm text-slate-500">{tools.length} tools added</span>
        </div>

        {tools.map((selection) => (
          <ToolInputCard
            key={selection.toolId}
            selection={selection}
            updateTool={updateTool}
            removeTool={removeTool}
          />
        ))}

        {tools.length === 0 && (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500 bg-slate-950/50">
            No tools added yet. Select a tool from below to start your audit.
          </div>
        )}
      </div>

      {/* Add Tool & Submit Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-800/50">
        <div className="relative w-full sm:w-64">
          <Select 
            onChange={handleAddTool} 
            defaultValue=""
            className="bg-slate-900 border-slate-700 text-slate-200 pl-10"
          >
            <option value="" disabled>Add another tool...</option>
            {availableTools.map((tool) => (
              <option key={tool.id} value={tool.id}>{tool.name}</option>
            ))}
          </Select>
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" pointerEvents="none" />
        </div>

        <Button 
          onClick={handleAudit}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 h-10"
        >
          Run Free Audit
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
