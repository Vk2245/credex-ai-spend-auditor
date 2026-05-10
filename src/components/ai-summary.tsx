"use client";

import { useEffect, useState } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { generateAudit } from "@/engine/audit";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Bot, AlertCircle } from "lucide-react";

export function AISummary() {
  const { teamSize, primaryUseCase, tools } = useAuditStore();
  
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchSummary() {
      try {
        const auditResult = generateAudit({ teamSize, primaryUseCase, tools });
        
        const res = await fetch("/api/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditResult, teamSize, primaryUseCase })
        });

        if (!res.ok) throw new Error("API Route failed");
        
        const data = await res.json();
        
        if (isMounted) {
          setSummary(data.summary);
          setIsFallback(data.isFallback);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error);
        if (isMounted) {
          setSummary("Based on standard industry benchmarks, optimizing your AI tooling stack by removing redundant code assistants and utilizing direct APIs for heavy workloads can significantly reduce your monthly burn rate.");
          setIsFallback(true);
          setIsLoading(false);
        }
      }
    }

    fetchSummary();

    return () => { isMounted = false; };
  }, [teamSize, primaryUseCase, tools]);

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/50 animate-pulse">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
            <Bot className="h-5 w-5 text-slate-500" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden group">
      {/* Subtle AI gradient background */}
      <div className="absolute top-0 right-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-700" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h3 className="font-semibold text-slate-200">CFO AI Summary</h3>
          {isFallback && (
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              <AlertCircle className="h-3 w-3" />
              Templated Fallback
            </span>
          )}
        </div>
        
        <p className="text-slate-300 text-sm leading-relaxed italic">
          "{summary}"
        </p>
      </CardContent>
    </Card>
  );
}
