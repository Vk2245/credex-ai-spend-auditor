"use client";

import { useMemo } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { generateAudit } from "@/engine/audit";
import { HeroSavings } from "./hero-savings";
import { ToolResultCard } from "./tool-result-card";
import { AISummary } from "./ai-summary";
import { LeadCaptureForm } from "./lead-capture-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function AuditResults() {
  const { teamSize, primaryUseCase, tools, setCurrentStep } = useAuditStore();

  // Run the pure engine logic using the latest Zustand state
  const auditResult = useMemo(() => {
    return generateAudit({ teamSize, primaryUseCase, tools });
  }, [teamSize, primaryUseCase, tools]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Back Button */}
      <button 
        onClick={() => setCurrentStep("form")}
        className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Edit Form
      </button>

      {/* Hero Savings Component */}
      <HeroSavings result={auditResult} />

      {/* Tool by Tool Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-800 pb-2">
          Line-Item Breakdown
        </h2>
        
        <div className="grid gap-4">
          {/* Sort recommendations so optimizations (savings > 0) appear first */}
          {[...auditResult.toolRecommendations]
            .sort((a, b) => b.savingsMonthly - a.savingsMonthly)
            .map((rec) => (
              <ToolResultCard key={rec.toolId} rec={rec} />
            ))
          }
        </div>
      </div>
      
      <div className="mt-8">
        <AISummary />
      </div>

      {/* Step 6: Lead Capture Form */}
      <LeadCaptureForm />

    </div>
  );
}
