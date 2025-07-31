import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.

Return in the following JSON format:
{
    "flashcards":[{
        "front": "string",
        "back": "string"
    }]
}`;

export async function POST(req) {
  const openai = new OpenAI();
  const { text } = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: text },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json({ flashcards: flashcards.flashcards });
}