import { AuditResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSavingsProps {
  result: AuditResult;
}

export function HeroSavings({ result }: HeroSavingsProps) {
  const isOptimal = result.totalMonthlySavings < 100;
  const isHighSavings = result.totalMonthlySavings >= 500;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-slate-800 bg-slate-900/50">
        {/* Subtle gradient background based on savings amount */}
        <div className={`absolute inset-0 opacity-10 ${isOptimal ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-emerald-500 to-cyan-500"}`} />
        
        <CardContent className="p-8 text-center relative z-10">
          <p className="text-slate-400 font-medium mb-2">
            {isOptimal ? "Your AI stack is looking healthy" : "Identified Overspend"}
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-6xl font-bold text-white">
              ${result.totalMonthlySavings}
            </h2>
            <span className="text-slate-500 text-xl self-end mb-2">/ mo</span>
          </div>
          
          <p className="text-emerald-400 font-medium text-lg flex items-center justify-center gap-2">
            <TrendingDown className="h-5 w-5" />
            ${result.totalAnnualSavings} projected annual savings
          </p>

          <div className="mt-8 max-w-2xl mx-auto">
            {isOptimal ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>Honest Audit: You are already highly optimized. Savings under $100/mo indicate good software hygiene.</span>
              </div>
            ) : isHighSavings ? (
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-left flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1 space-y-2">
                  <h3 className="text-emerald-400 font-semibold text-lg">Massive Savings Potential</h3>
                  <p className="text-slate-300 text-sm">
                    You&apos;re bleeding over $6,000 annually in redundant AI tooling. 
                    Credex can negotiate enterprise volume discounts and enforce standard tooling for your team.
                  </p>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap">
                  Book Credex Consultation
                </Button>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                Apply the tool-specific recommendations below to stop bleeding cash and streamline your team&apos;s workflows.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Global Recommendations Array */}
      {result.globalRecommendations.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm space-y-2">
          <p className="font-semibold text-amber-500">Macro Analysis:</p>
          <ul className="list-disc pl-5 space-y-1">
            {result.globalRecommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
