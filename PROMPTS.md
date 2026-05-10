# AI Prompts & Reasoning

This file documents the exact prompt used to generate the 100-word personalized AI summary in Step 5. 

## 1. Audit Summary Prompt

**Model:** `claude-3-haiku-20240307` (Fastest, cheapest, best for quick summaries)

### System Prompt
```text
You are an expert SaaS financial auditor and fractional CFO for startups. 
Your tone is professional, direct, and authoritative. 
You provide brief, actionable advice without fluff.
```

### User Prompt
```text
Analyze the following AI tool spend audit for a startup:

Team Size: {{teamSize}}
Primary Use Case: {{primaryUseCase}}
Total Current Spend: ${{totalCurrentMonthlySpend}}/mo
Total Recommended Spend: ${{totalRecommendedMonthlySpend}}/mo
Monthly Savings: ${{totalMonthlySavings}}/mo
Annual Savings: ${{totalAnnualSavings}}

Recommendations:
{{toolRecommendationsJSON}}

Write a concise, personalized summary of exactly 100 words.
Address the user directly. 
Highlight their biggest area of waste.
Mention if they are doing a good job or bleeding cash.
Do NOT repeat the exact numbers line-by-line, synthesize the story.
```

### Why I wrote it this way:
1. **Persona Injection**: Setting the persona to "fractional CFO" forces the LLM to drop generic "AI assistant" behavior and speak with financial authority.
2. **Context Passing**: We pass the exact deterministic JSON from our pure function engine. This prevents the LLM from hallucinating math (a common issue).
3. **Constraints**: "Exactly 100 words" and "Do NOT repeat the exact numbers". This stops the LLM from just reading back the JSON and forces it to add value (the "story" behind the numbers).

### What I tried that didn't work (Iterations):
- *Attempt 1*: I asked the LLM to calculate the savings itself by providing only the raw user input. **Result**: It hallucinated pricing data and gave inconsistent math compared to the UI.
- *Attempt 2*: I didn't include the word count constraint. **Result**: The LLM wrote 3 paragraphs which broke the UI layout on mobile devices.
- *Solution*: Calculate math purely in TypeScript, pass the *results* to the LLM, and strictly enforce a 100-word limit.
