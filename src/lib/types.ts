export type AIUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId = 
  | "cursor" 
  | "github_copilot" 
  | "claude" 
  | "chatgpt" 
  | "anthropic_api" 
  | "openai_api" 
  | "gemini" 
  | "windsurf";

export type PlanId = 
  | "free"
  | "hobby"
  | "pro"
  | "pro_plus"
  | "max_5x"
  | "max_20x"
  | "plus"
  | "business"
  | "teams"
  | "team"
  | "enterprise"
  | "ultra"
  | "api_direct";

export interface PricingTier {
  id: PlanId;
  name: string;
  pricePerMonth: number;
  isPerSeat: boolean;
  features?: string[];
}

export interface ToolPricing {
  id: ToolId;
  name: string;
  category: "assistant" | "chat" | "api";
  tiers: PricingTier[];
}

export interface UserToolSelection {
  toolId: ToolId;
  planId: PlanId;
  seats: number;
  monthlySpend: number; // User's self-reported spend
}

export interface UserInputState {
  teamSize: number;
  primaryUseCase: AIUseCase;
  tools: UserToolSelection[];
}

export interface ToolRecommendation {
  toolId: ToolId;
  currentSpend: number;
  recommendedAction: "KEEP" | "DOWNGRADE" | "SWITCH_PLAN" | "SWITCH_TOOL" | "MOVE_TO_API";
  recommendedPlanId?: PlanId;
  recommendedToolId?: ToolId;
  savingsMonthly: number;
  reason: string;
}

export interface AuditResult {
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolRecommendations: ToolRecommendation[];
  globalRecommendations: string[]; // For overlaps, e.g., "You have 2 code assistants"
}
