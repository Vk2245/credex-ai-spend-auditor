"use client";

import { useAuditStore } from "@/store/useAuditStore";
import { SpendForm } from "@/components/spend-form";
import { AuditResults } from "@/components/audit-results";

export default function Home() {
  const { currentStep } = useAuditStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* ── Header ── */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-950">C</span>
            </div>
            <span className="text-lg font-semibold text-white">
              Credex<span className="text-emerald-400">Audit</span>
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Free AI Spend Audit
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {currentStep === "form" ? (
          <section>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Is your startup{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  overspending
                </span>{" "}
                on AI tools?
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Enter what you pay for Cursor, Copilot, ChatGPT, Claude &amp; more. 
                Get an instant audit with actionable savings — no signup required.
              </p>
            </div>

            <SpendForm />
          </section>
        ) : (
          <section>
            <AuditResults />
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-600">
          Built for the Credex WebDev 2026 Assignment
        </div>
      </footer>
    </div>
  );
}
