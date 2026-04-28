import { ImageAnnotatorClient } from '@google-cloud/vision';
import { VertexAI } from '@google-cloud/vertexai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const description = formData.get('description');
    const imageFile = formData.get('image');

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    // Initialize SDKs inside the handler to avoid build-time errors
    const visionClient = new ImageAnnotatorClient();
    const vertex_ai = new VertexAI({ 
      project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'crisis-link-33b22', 
      location: 'us-central1' 
    });

    let visionResults = {
      detected_objects: [],
      risk_level: 'low',
      confidence_score: 0
    };

    // --- STEP 1: OFFICIAL VISION AI INTEGRATION ---
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const [result] = await visionClient.annotateImage({
        image: { content: buffer.toString('base64') },
        features: [
          { type: 'LABEL_DETECTION' },
          { type: 'OBJECT_LOCALIZATION' },
          { type: 'SAFE_SEARCH_DETECTION' }
        ],
      });

      const labels = result.labelAnnotations || [];
      const objects = result.localizedObjectAnnotations || [];
      
      visionResults.detected_objects = [
        ...new Set([
          ...labels.filter(l => l.score > 0.7).map(l => l.description.toLowerCase()),
          ...objects.filter(o => o.score > 0.7).map(o => o.name.toLowerCase())
        ])
      ];

      const hazards = ['fire', 'smoke', 'flame', 'blood', 'injury', 'accident', 'crowd', 'panic'];
      const foundHazards = visionResults.detected_objects.filter(obj => hazards.includes(obj));
      
      if (foundHazards.length > 0) visionResults.risk_level = 'high';
      visionResults.confidence_score = Math.round((labels[0]?.score || 0) * 100);
    }

    // --- STEP 2: OFFICIAL VERTEX AI (GEMINI) INTEGRATION ---
    const generativeModel = vertex_ai.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `
      You are an expert crisis response system.
      TEXT DESCRIPTION: "${description}"
      VISION AI FINDINGS: ${JSON.stringify(visionResults.detected_objects)}
      
      Analyze the combined data and respond with ONLY a raw JSON object:
      {
        "severity": "critical" | "medium" | "low",
        "summary": "AI-generated summary",
        "recommended_action": "Responder steps",
        "priority_score": 1-10
      }
      
      LOGIC: If Vision AI found hazards, factor this into severity.
    `;

    const response = await generativeModel.generateContent(prompt);
    const responseText = response.response.candidates[0].content.parts[0].text.trim();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let aiAnalysis;
    try {
      aiAnalysis = JSON.parse(cleanJson);
    } catch (e) {
      aiAnalysis = {
        severity: visionResults.risk_level === 'high' ? 'critical' : 'medium',
        summary: description,
        recommended_action: "Investigate immediate area.",
        priority_score: visionResults.risk_level === 'high' ? 9 : 5
      };
    }

    return NextResponse.json({
      ...aiAnalysis,
      vision_analysis: visionResults
    });

  } catch (error) {
    console.error('Vertex AI / Vision AI Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
