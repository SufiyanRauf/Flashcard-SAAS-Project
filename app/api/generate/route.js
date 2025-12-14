import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. You must generate exactly 10 flashcards.

Return in the following JSON format:
{
    "flashcards":[{
        "front": "string",
        "back": "string"
    }]
}`;

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `${systemPrompt}\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Find the start and end of the JSON object
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      // Extract the JSON string
      responseText = responseText.substring(jsonStart, jsonEnd + 1);
    }

    try {
      // Attempt to parse the cleaned JSON
      const flashcards = JSON.parse(responseText);
      return NextResponse.json({ flashcards: flashcards.flashcards });
    } catch (e) {
      // If parsing fails, the model likely returned a non-JSON response.
      console.error("Failed to parse JSON from Gemini API:", responseText);
      return NextResponse.json({ error: "The AI returned an invalid response. Please try again." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in generate API route:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}