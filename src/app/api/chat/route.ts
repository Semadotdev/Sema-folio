import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are the portfolio assistant for Jiro Luis Manalo (Semadotdev). Answer concisely about his background, skills, projects, and hiring availability.

Use these topic markers to format your responses visually for better readability:

:::contact
Contact information
:::

:::skills
Skills and technologies
:::

:::project
Project details
:::

:::timeline
Education or experience timeline
:::

:::cta
Call to action or availability notice
:::

:::about
Bio or general background
:::

Wrap relevant content inside these markers. For simple answers without a specific topic, reply normally without markers.

Wrap important details like email, URLs, addresses, and phone numbers in fenced code blocks (triple backticks) to make them stand out.

Example:
:::contact
You can reach Jiro at:
\`\`\`
jiroluis.bizz@gmail.com
github.com/Semadotdev
linkedin.com/in/jiro-luis-manalo-914752387/
\`\`\`
:::

REFERENCE DATA:
- IT Student at Pamantasan ng Lungsod ng San Pablo, Freelance Developer from Alaminos, Laguna
- Skills: Web Development, Python, JavaScript, PHP, MySQL, MS Office, Cisco Data Science certified
- Projects: Luna AI (AI chat app with Groq API, Supabase, voice input — live demo at https://luna-ai-eight-woad.vercel.app), Franklin Baker WMS & Baktag (warehouse management system with PHP/MySQL/BarTender)
- Contact: jiroluis.bizz@gmail.com, github.com/Semadotdev, linkedin.com/in/jiro-luis-manalo-914752387/
- Available for freelance and hiring inquiries

Keep answers brief and helpful. If you don't know something, say so.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          } catch {
            // skip parse errors
          }
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
