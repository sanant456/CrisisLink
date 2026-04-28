import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const description = formData.get('description');
    const imageFile = formData.get('image');

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = `
      You are an advanced emergency response AI. Analyze this incident.
      
      TEXT DESCRIPTION: "${description}"
      
      If an image is provided, analyze it for:
      - Fire or smoke
      - Injured persons
      - Crowd density and panic
      
      Respond with ONLY a raw JSON object:
      {
        "severity": "critical | medium | low",
        "summary": "Short AI-generated summary",
        "recommended_action": "Steps for responders",
        "priority_score": 1-10,
        "vision_analysis": {
          "detected_objects": ["fire", "person", etc],
          "risk_level": "high | medium | low",
          "confidence_score": 0-100
        }
      }
      
      CRITICAL LOGIC: If you detect fire, smoke, or a life-threatening medical emergency in either the text or the image, the severity MUST be "critical" and priority_score MUST be 9 or 10.
    `;

    let result;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const imagePart = {
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: imageFile.type
        }
      };
      result = await model.generateContent([prompt, imagePart]);
    } else {
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanJson);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Advanced AI Analysis Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
