import { ToolRecommendation } from "@/lib/types";
import { getToolDetails } from "@/lib/pricing-data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, AlertTriangle, ArrowDownCircle, CloudLightning } from "lucide-react";

interface ToolResultCardProps {
  rec: ToolRecommendation;
}

export function ToolResultCard({ rec }: ToolResultCardProps) {
  const toolDetails = getToolDetails(rec.toolId);
  const recommendedToolDetails = rec.recommendedToolId ? getToolDetails(rec.recommendedToolId) : toolDetails;
  
  if (!toolDetails) return null;

  // Visual mapping for actions
  const ACTION_MAP = {
    KEEP: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: CheckCircle2,
      label: "Optimal",
    },
    DOWNGRADE: {
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: ArrowDownCircle,
      label: "Drop Tool",
    },
    SWITCH_PLAN: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: AlertTriangle,
      label: "Change Plan",
    },
    SWITCH_TOOL: {
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      icon: ArrowRight,
      label: "Switch Provider",
    },
    MOVE_TO_API: {
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      icon: CloudLightning,
      label: "Move to API",
    },
  };

  const config = ACTION_MAP[rec.recommendedAction];
  const Icon = config.icon;
  const isOptimal = rec.recommendedAction === "KEEP";

  return (
    <Card className={`border ${isOptimal ? "border-slate-800 bg-slate-900/30" : config.border + " " + config.bg}`}>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          
          {/* Tool Identifier */}
          <div className="w-48 shrink-0">
            <h3 className="font-semibold text-slate-200">{toolDetails.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color} border ${config.border}`}>
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Money flow */}
          <div className="flex items-center gap-3 shrink-0 bg-slate-950/50 rounded-lg px-4 py-2 border border-slate-800">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Current</p>
              <p className="text-slate-300 font-mono">${rec.currentSpend}/mo</p>
            </div>
            {!isOptimal && (
              <>
                <ArrowRight className="h-4 w-4 text-slate-600" />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">New</p>
                  <p className="text-emerald-400 font-mono">${rec.currentSpend - rec.savingsMonthly}/mo</p>
                </div>
              </>
            )}
          </div>

          {/* Reason */}
          <div className="flex-1 mt-2 md:mt-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-800/50 pt-2 md:pt-0">
            <p className="text-sm text-slate-300 leading-relaxed">
              {rec.reason}
            </p>
            {!isOptimal && rec.savingsMonthly > 0 && (
              <p className="text-emerald-400 text-xs font-semibold mt-2">
                Saves ${rec.savingsMonthly} monthly (${rec.savingsMonthly * 12} annually)
              </p>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
