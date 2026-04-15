import { NextResponse } from "next/server";
import OpenAI from "openai";

// Instantiate OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Ensure you have this in .env.local
});

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is missing. Please add OPENAI_API_KEY to your environment variables." }, { status: 500 });
    }

    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: "Topic/Keyword is required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert SEO content writer and affiliate marketer. 
    Write a highly engaging, human-like, SEO-optimized blog post (1000+ words) about the given topic. 
    The tone should not be robotic; it should provide real value, practical insights, and be AdSense-friendly (no spammy or policy-violating content).
    Include:
    - An engaging intro (perfect for AdSense placeholder immediately after)
    - Structured headings (H2, H3 tags)
    - Detailed, practical content in the middle (perfect for AdSense placeholder)
    - A Frequently Asked Questions (FAQ) section
    - A strong conclusion (perfect for AdSense placeholder)
    Do not include literal "[AdSense Placeholder]" text; just structure it so there are natural breaks.

    Output the response STRICTLY as a JSON object with the following fields:
    - title: (Catchy, SEO optimized H1 title)
    - slug: (URL-friendly string)
    - summary: (A 2-3 sentence engaging summary)
    - content: (The full article in valid, clean HTML format, using proper <h2>, <h3>, <p>, <ul> elements)
    - metaTitle: (SEO Meta Title, max 60 chars)
    - metaDescription: (SEO Meta Description, max 160 chars)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost-efficiency, can be upgraded to gpt-4 if preferred
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Topic: ${topic}` },
      ],
      temperature: 0.7,
    });

    const generatedData = JSON.parse(completion.choices[0].message.content);
    
    return NextResponse.json(generatedData, { status: 200 });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate blog" }, { status: 500 });
  }
}
