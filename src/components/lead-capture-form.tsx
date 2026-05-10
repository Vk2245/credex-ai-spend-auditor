"use client";

import { useState } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { generateAudit } from "@/engine/audit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Briefcase, Lock, FileText } from "lucide-react";

export function LeadCaptureForm() {
  const { teamSize, primaryUseCase, tools } = useAuditStore();
  
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Abuse protection
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Re-generate audit data to save the context of the lead
      const auditResult = generateAudit({ teamSize, primaryUseCase, tools });

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          companyName, 
          honeypot,
          auditData: { 
            teamSize, 
            primaryUseCase, 
            tools, 
            annualSavings: auditResult.totalAnnualSavings 
          }
        })
      });

      if (!res.ok) throw new Error("Failed to submit lead");

      setIsSubmitted(true);
      toast.success("Detailed report sent to your email!");
    } catch (error) {
      console.error("Lead capture failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // State: Post-submission
  if (isSubmitted) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/10 text-center py-8">
        <CardContent className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-400">Audit Saved!</h3>
            <p className="text-slate-300 mt-2 text-sm max-w-md mx-auto">
              We&apos;ve generated your custom PDF report and optimization playbook. Check your inbox shortly.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State: Default Lead Capture Form
  return (
    <Card className="border-slate-800 bg-slate-900/50 mt-12 relative overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
          <FileText className="h-5 w-5 text-blue-400" />
        </div>
        <CardTitle className="text-xl text-slate-200">Want the full detailed PDF report?</CardTitle>
        <CardDescription className="text-slate-400 max-w-md mx-auto">
          Get a beautiful PDF copy of this audit, industry benchmark data, and a step-by-step implementation guide to start saving today.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          {/* Honeypot field for abuse protection - invisible to real users */}
          <div className="absolute opacity-0 -z-10" aria-hidden="true">
            <input 
              type="text" 
              name="honeypot" 
              tabIndex={-1} 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Work Email <span className="text-red-400">*</span></Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@startup.com" 
                className="pl-10 bg-slate-950 border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Company Name <span className="text-slate-500 font-normal">(Optional)</span></Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                type="text" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corp" 
                className="pl-10 bg-slate-950 border-slate-800 text-slate-200"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isLoading ? "Processing..." : "Email Me The Report"}
          </Button>
          
          <p className="text-xs text-center text-slate-500 flex items-center justify-center gap-1 mt-4">
            <Lock className="h-3 w-3" /> We respect your privacy. No spam.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
