import { ToolPricing } from "./types";

// Pricing data is current as of May 2026.
// Every number here should be traceable to PRICING_DATA.md

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    category: "assistant",
    tiers: [
      { id: "hobby", name: "Hobby", pricePerMonth: 0, isPerSeat: false },
      { id: "pro", name: "Pro", pricePerMonth: 20, isPerSeat: false },
      { id: "pro_plus", name: "Pro+", pricePerMonth: 60, isPerSeat: false },
      { id: "teams", name: "Teams", pricePerMonth: 40, isPerSeat: true },
    ],
  },
  github_copilot: {
    id: "github_copilot",
    name: "GitHub Copilot",
    category: "assistant",
    tiers: [
      { id: "pro", name: "Pro", pricePerMonth: 10, isPerSeat: false },
      { id: "pro_plus", name: "Pro+", pricePerMonth: 39, isPerSeat: false },
      { id: "business", name: "Business", pricePerMonth: 19, isPerSeat: true },
      { id: "enterprise", name: "Enterprise", pricePerMonth: 39, isPerSeat: true },
    ],
  },
  claude: {
    id: "claude",
    name: "Claude",
    category: "chat",
    tiers: [
      { id: "free", name: "Free", pricePerMonth: 0, isPerSeat: false },
      { id: "pro", name: "Pro", pricePerMonth: 20, isPerSeat: false },
      { id: "max_5x", name: "Max (5x)", pricePerMonth: 100, isPerSeat: false },
      { id: "max_20x", name: "Max (20x)", pricePerMonth: 200, isPerSeat: false },
      { id: "team", name: "Team", pricePerMonth: 25, isPerSeat: true }, // Minimum 5 seats usually, handled in logic
    ],
  },
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    category: "chat",
    tiers: [
      { id: "free", name: "Free", pricePerMonth: 0, isPerSeat: false },
      { id: "plus", name: "Plus", pricePerMonth: 20, isPerSeat: false },
      { id: "pro", name: "Pro ($100)", pricePerMonth: 100, isPerSeat: false },
      { id: "max_20x", name: "Pro ($200)", pricePerMonth: 200, isPerSeat: false },
      { id: "business", name: "Business", pricePerMonth: 25, isPerSeat: true },
    ],
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    category: "chat",
    tiers: [
      { id: "free", name: "Free", pricePerMonth: 0, isPerSeat: false },
      { id: "pro", name: "Pro", pricePerMonth: 19.99, isPerSeat: false },
      { id: "ultra", name: "Ultra", pricePerMonth: 249.99, isPerSeat: false },
    ],
  },
  windsurf: {
    id: "windsurf",
    name: "Windsurf AI IDE",
    category: "assistant",
    tiers: [
      { id: "free", name: "Free", pricePerMonth: 0, isPerSeat: false },
      { id: "pro", name: "Pro", pricePerMonth: 20, isPerSeat: false },
      { id: "teams", name: "Teams", pricePerMonth: 40, isPerSeat: true },
      { id: "ultra", name: "Max", pricePerMonth: 200, isPerSeat: false }, // Named ultra in plan IDs for consistency
    ],
  },
  anthropic_api: {
    id: "anthropic_api",
    name: "Anthropic API Direct",
    category: "api",
    tiers: [
      { id: "api_direct", name: "Pay as you go", pricePerMonth: 0, isPerSeat: false }, // Variable cost
    ],
  },
  openai_api: {
    id: "openai_api",
    name: "OpenAI API Direct",
    category: "api",
    tiers: [
      { id: "api_direct", name: "Pay as you go", pricePerMonth: 0, isPerSeat: false }, // Variable cost
    ],
  },
};

export function getToolDetails(toolId: string) {
  return PRICING_DATA[toolId];
}

export function getPlanDetails(toolId: string, planId: string) {
  const tool = PRICING_DATA[toolId];
  return tool?.tiers.find(t => t.id === planId);
}
