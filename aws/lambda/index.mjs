import OpenAI from "openai";

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://staging.d1gk5r8nqlxue7.amplifyapp.com/",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  let notes;
  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    notes = body?.notes?.trim();
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body." }),
    };
  }
  if (!notes) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Field 'notes' is required." }),
    };
  }

  const prompt = `
You are a study assistant. Read the notes below and generate flashcards.

Rules:
- Return ONLY a valid JSON array, no markdown, no explanation.
- Each item must have exactly these fields:
  - "id": unique string number ("1", "2", …)
  - "question": a clear, concise question
  - "answer": a clear, concise answer
  - "category": a short topic label inferred from the notes

Notes:
"""
${notes}
"""
`;

  let flashcards;
  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "X-Title": "AIFlash",
      }
    });
    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0].message.content;

    const parsed = JSON.parse(raw);
    flashcards = Array.isArray(parsed)
      ? parsed
      : parsed.flashcards ?? Object.values(parsed)[0];

    if (!Array.isArray(flashcards)) {
      throw new Error("Unexpected shape from AI response.");
    }
  } catch (err) {
    console.error("OpenAI error:", err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to generate flashcards." }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ flashcards }),
  };
};