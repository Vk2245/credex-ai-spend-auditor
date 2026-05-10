import { NextResponse } from "next/server";
import { AuditResult } from "@/lib/types";

// Types for the request body
interface SummaryRequest {
  auditResult: AuditResult;
  teamSize: number;
  primaryUseCase: string;
}

export async function POST(req: Request) {
  try {
    const body: SummaryRequest = await req.json();
    const { auditResult, teamSize, primaryUseCase } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Graceful Fallback if API key is missing (Assignment requirement)
    if (!apiKey) {
      return NextResponse.json({ 
        summary: generateFallbackSummary(auditResult, teamSize, primaryUseCase),
        isFallback: true 
      });
    }

    const systemPrompt = "You are an expert SaaS financial auditor and fractional CFO for startups. Your tone is professional, direct, and authoritative. You provide brief, actionable advice without fluff.";
    
    const userPrompt = `
      Analyze the following AI tool spend audit for a startup:
      Team Size: ${teamSize}
      Primary Use Case: ${primaryUseCase}
      Monthly Savings: $${auditResult.totalMonthlySavings}/mo
      Annual Savings: $${auditResult.totalAnnualSavings}
      Recommendations: ${JSON.stringify(auditResult.toolRecommendations)}

      Write a concise, personalized summary of roughly 100 words.
      Address the user directly. Highlight their biggest area of waste.
      Mention if they are doing a good job or bleeding cash.
      Do NOT repeat the exact numbers line-by-line, synthesize the story.
    `;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      summary: data.content[0].text,
      isFallback: false 
    });

  } catch (error) {
    console.error("Summary Generation Error:", error);
    // Graceful Fallback on API failure
    return NextResponse.json({ 
      summary: generateFallbackSummary(null, 1, "mixed"), // Pass generic data if parsing fails completely
      isFallback: true 
    });
  }
}

// ── TEMPLATED FALLBACK (Assignment Requirement) ──
function generateFallbackSummary(auditResult: AuditResult | null, teamSize: number, useCase: string) {
  if (!auditResult) {
    return "Based on standard industry benchmarks, optimizing your AI tooling stack by removing redundant code assistants and utilizing direct APIs for heavy workloads can significantly reduce your monthly burn rate.";
  }

  if (auditResult.totalMonthlySavings < 100) {
    return `For a team of ${teamSize} focused on ${useCase}, your AI software spend is remarkably optimized. You are avoiding the common trap of overlapping subscriptions. Keep maintaining this lean approach as your team scales.`;
  }

  const highestSavingTool = auditResult.toolRecommendations.reduce((prev, current) => 
    (prev.savingsMonthly > current.savingsMonthly) ? prev : current
  );

  return `Your team of ${teamSize} is overspending on AI tools for ${useCase}. You are currently bleeding cash on redundant subscriptions, specifically around ${highestSavingTool.toolId}. By cutting overlapping tools and optimizing plans to match actual usage, you can instantly recover $${auditResult.totalAnnualSavings} annually without sacrificing productivity.`;
}
