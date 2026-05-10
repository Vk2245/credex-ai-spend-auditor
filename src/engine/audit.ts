import { 
  UserInputState, 
  AuditResult, 
  ToolRecommendation
} from "@/lib/types";
import { getPlanDetails, PRICING_DATA } from "@/lib/pricing-data";

/**
 * PURE FUNCTION: The Audit Engine
 * Takes user inputs and returns a deterministic financial audit result.
 * No side effects, no API calls. Highly testable.
 */
export function generateAudit(input: UserInputState): AuditResult {
  let totalCurrentMonthlySpend = 0;
  let totalRecommendedMonthlySpend = 0;
  const toolRecommendations: ToolRecommendation[] = [];
  const globalRecommendations: string[] = [];

  const toolIds = input.tools.map(t => t.toolId);
  const hasCursor = toolIds.includes("cursor");
  const hasCopilot = toolIds.includes("github_copilot");
  const hasChatGPT = toolIds.includes("chatgpt");
  const hasClaude = toolIds.includes("claude");

  // ── GLOBAL RULES (Macro Analysis) ──
  
  if (hasCursor && hasCopilot) {
    globalRecommendations.push(
      "You are paying for multiple AI code assistants (Cursor and Copilot). Standardizing on Cursor reduces context-switching and eliminates redundant licensing costs."
    );
  }

  if (hasChatGPT && hasClaude && input.teamSize > 2) {
    globalRecommendations.push(
      "Your team is fragmented across ChatGPT and Claude. Standardizing on a single enterprise/team plan improves knowledge sharing and often unlocks volume discounts."
    );
  }

  // ── TOOL-SPECIFIC RULES (Micro Analysis) ──

  for (const selection of input.tools) {
    const planDetails = getPlanDetails(selection.toolId, selection.planId);
    if (!planDetails) continue;

    // Calculate theoretical minimum retail spend
    const theoreticalMinSpend = planDetails.isPerSeat 
      ? planDetails.pricePerMonth * selection.seats 
      : planDetails.pricePerMonth;
    
    totalCurrentMonthlySpend += selection.monthlySpend;

    let recAction: ToolRecommendation["recommendedAction"] = "KEEP";
    let recPlanId = selection.planId;
    const recToolId = selection.toolId;
    let recommendedSpend = selection.monthlySpend;
    let reason = "Your current plan is optimal for your reported usage.";

    // Rule 1: Paying significantly more than retail (Zombie subscriptions/unused seats)
    if (selection.monthlySpend > theoreticalMinSpend * 1.1) {
        recAction = "SWITCH_PLAN";
        recommendedSpend = theoreticalMinSpend;
        reason = `You report $${selection.monthlySpend}/mo but retail price for ${selection.seats} seat(s) is $${theoreticalMinSpend}. Audit your billing for unused licenses (zombie seats) or forgotten add-ons.`;
    } 
    // Rule 2: Has Cursor and Copilot -> Keep Cursor, drop Copilot
    else if (selection.toolId === "github_copilot" && hasCursor) {
        recAction = "DOWNGRADE";
        recommendedSpend = 0;
        reason = "Since you already use Cursor, GitHub Copilot is redundant. Cursor's native autocomplete and Composer fully replace Copilot's functionality.";
    }
    // Rule 3: Has Claude Pro but already has Cursor for Coding
    else if (selection.toolId === "claude" && selection.planId === "pro" && hasCursor && input.primaryUseCase === "coding") {
        recAction = "DOWNGRADE";
        recommendedSpend = 0;
        reason = "You pay for Claude Pro, but your primary use case is coding and you already have Cursor (which includes Claude 3.5 Sonnet). You can drop the web subscription.";
    }
    // Rule 4: Solo user overpaying for Team/Business plans
    else if (planDetails.isPerSeat && selection.seats === 1 && selection.monthlySpend >= 25 && selection.toolId !== "github_copilot") {
        const proPlan = PRICING_DATA[selection.toolId].tiers.find(t => t.id === "pro");
        if (proPlan && proPlan.pricePerMonth < selection.monthlySpend) {
            recAction = "SWITCH_PLAN";
            recPlanId = "pro";
            recommendedSpend = proPlan.pricePerMonth;
            reason = `As a solo user (1 seat), you are paying a premium for a Teams/Business plan. Downgrading to the Pro plan saves money without losing core AI features.`;
        }
    }
    // Rule 5: Extreme power users / High limits -> Move to API
    else if ((selection.toolId === "chatgpt" || selection.toolId === "claude") && selection.monthlySpend >= 100) {
        recAction = "MOVE_TO_API";
        recPlanId = "api_direct";
        recommendedSpend = 40; // Estimated API cost for power users
        reason = `You are on an expensive high-limit tier ($${selection.monthlySpend}/mo). Moving heavy automated workloads directly to the API typically reduces costs by 50-70%.`;
    }
    // Default: Just correct to theoretical minimum if they over-reported slightly
    else {
        recommendedSpend = Math.min(selection.monthlySpend, theoreticalMinSpend);
        if (recommendedSpend < selection.monthlySpend) {
            reason = `Adjusted to standard retail price ($${theoreticalMinSpend}) from your reported spend.`;
        }
    }

    const savingsMonthly = selection.monthlySpend - recommendedSpend;
    totalRecommendedMonthlySpend += recommendedSpend;

    toolRecommendations.push({
      toolId: selection.toolId,
      currentSpend: selection.monthlySpend,
      recommendedAction: recAction,
      recommendedPlanId: recPlanId,
      recommendedToolId: recToolId,
      savingsMonthly,
      reason,
    });
  }

  const totalMonthlySavings = totalCurrentMonthlySpend - totalRecommendedMonthlySpend;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolRecommendations,
    globalRecommendations
  };
}
