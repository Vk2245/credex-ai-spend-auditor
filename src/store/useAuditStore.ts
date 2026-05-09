import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIUseCase, ToolId, PlanId, UserToolSelection, AuditResult } from "@/lib/types";

// ─────────────────────────────────────────────────────────
// Store Interface — Yeh define karta hai ki store mein kya kya hoga
// ─────────────────────────────────────────────────────────
interface AuditStoreState {
  // ── User Inputs ──
  teamSize: number;
  primaryUseCase: AIUseCase;
  tools: UserToolSelection[];

  // ── Audit Result (Engine ke output ke baad fill hoga) ──
  auditResult: AuditResult | null;

  // ── AI Summary ──
  aiSummary: string | null;
  aiSummaryLoading: boolean;

  // ── UI State ──
  currentStep: "form" | "results";
}

interface AuditStoreActions {
  // ── Tool Management ──
  addTool: (toolId: ToolId, planId: PlanId) => void;
  removeTool: (toolId: ToolId) => void;
  updateTool: (toolId: ToolId, updates: Partial<UserToolSelection>) => void;

  // ── Form Fields ──
  setTeamSize: (size: number) => void;
  setPrimaryUseCase: (useCase: AIUseCase) => void;

  // ── Audit Results ──
  setAuditResult: (result: AuditResult) => void;
  setAiSummary: (summary: string) => void;
  setAiSummaryLoading: (loading: boolean) => void;

  // ── Navigation ──
  setCurrentStep: (step: "form" | "results") => void;

  // ── Reset ──
  resetAll: () => void;
}

// ── Default State ──
const initialState: AuditStoreState = {
  teamSize: 1,
  primaryUseCase: "coding",
  tools: [],
  auditResult: null,
  aiSummary: null,
  aiSummaryLoading: false,
  currentStep: "form",
};

// ─────────────────────────────────────────────────────────
// The Store — Zustand + Persist Middleware
// ─────────────────────────────────────────────────────────
export const useAuditStore = create<AuditStoreState & AuditStoreActions>()(
  persist(
    (set, get) => ({
      // ── Spread initial state ──
      ...initialState,

      // ── Add a new tool to the list ──
      addTool: (toolId: ToolId, planId: PlanId) => {
        const existing = get().tools.find((t) => t.toolId === toolId);
        if (existing) return; // Don't add duplicates

        set((state) => ({
          tools: [
            ...state.tools,
            {
              toolId,
              planId,
              seats: 1,
              monthlySpend: 0,
            },
          ],
        }));
      },

      // ── Remove a tool from the list ──
      removeTool: (toolId: ToolId) => {
        set((state) => ({
          tools: state.tools.filter((t) => t.toolId !== toolId),
        }));
      },

      // ── Update a specific tool's details ──
      updateTool: (toolId: ToolId, updates: Partial<UserToolSelection>) => {
        set((state) => ({
          tools: state.tools.map((t) =>
            t.toolId === toolId ? { ...t, ...updates } : t
          ),
        }));
      },

      // ── Simple setters ──
      setTeamSize: (size: number) => set({ teamSize: Math.max(1, size) }),
      setPrimaryUseCase: (useCase: AIUseCase) => set({ primaryUseCase: useCase }),
      setAuditResult: (result: AuditResult) => set({ auditResult: result }),
      setAiSummary: (summary: string) => set({ aiSummary: summary }),
      setAiSummaryLoading: (loading: boolean) => set({ aiSummaryLoading: loading }),
      setCurrentStep: (step: "form" | "results") => set({ currentStep: step }),

      // ── Reset everything back to initial state ──
      resetAll: () => set(initialState),
    }),
    {
      name: "credex-audit-storage", // localStorage key
      // Only persist user inputs, not derived state like results
      partialize: (state) => ({
        teamSize: state.teamSize,
        primaryUseCase: state.primaryUseCase,
        tools: state.tools,
        currentStep: state.currentStep,
      }),
    }
  )
);
