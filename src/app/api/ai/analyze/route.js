import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert crisis response AI system for a hospitality venue (like a hotel or resort).
      Analyze the following emergency incident description reported by a guest or staff member.
      
      Incident Description: "${description}"
      
      Respond with ONLY a valid JSON object matching the following structure:
      {
        "severity": "critical" | "medium" | "low",
        "summary": "A concise 1-sentence summary of the incident",
        "recommended_action": "A 1-2 sentence recommendation for the first responders"
      }
      
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON string.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up potential markdown blocks if the model ignores the instruction
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanJson);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
