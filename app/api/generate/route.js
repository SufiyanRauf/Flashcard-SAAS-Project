import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const { text } = await req.json();

  // Change this line to use the new model name
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `${systemPrompt}\n\n${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const flashcards = JSON.parse(response.text());

  return NextResponse.json({ flashcards: flashcards.flashcards });
}