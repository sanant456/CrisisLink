import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let genAI = null;
let model = null;

function getModel() {
  if (!API_KEY || API_KEY === '') {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return model;
}

/**
 * Analyze an incident report and return severity classification + suggestions
 */
export async function analyzeIncident(type, description, location) {
  const ai = getModel();
  
  // Fallback mock analysis when Gemini API key is not configured
  if (!ai) {
    return getMockAnalysis(type, description);
  }

  try {
    const prompt = `You are CrisisLink AI, an emergency response analysis system for hospitality venues.

Analyze this incident report and respond in valid JSON only (no markdown):

INCIDENT TYPE: ${type}
DESCRIPTION: ${description}
LOCATION: ${location || 'Unknown'}

Respond with this exact JSON structure:
{
  "severity": "critical" or "high" or "medium" or "low",
  "confidence": 0.0 to 1.0,
  "summary": "Brief 2-sentence situational summary",
  "suggestedActions": ["action1", "action2", "action3", "action4", "action5"],
  "estimatedResponseTime": "e.g., 2-5 minutes",
  "riskFactors": ["risk1", "risk2"],
  "requiredDepartments": ["security", "medical", "fire_safety", "maintenance"]
}

Be specific and actionable. Consider the hospitality venue context.`;

    const result = await ai.generateContent(prompt);
    const text = result.response.text();
    
    // Parse JSON from response (strip markdown code blocks if present)
    const jsonStr = text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(jsonStr);
    
    return {
      severity: analysis.severity || 'medium',
      confidence: analysis.confidence || 0.8,
      summary: analysis.summary || 'Incident analysis completed.',
      suggestedActions: analysis.suggestedActions || [],
      estimatedResponseTime: analysis.estimatedResponseTime || 'Unknown',
      riskFactors: analysis.riskFactors || [],
      requiredDepartments: analysis.requiredDepartments || [],
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return getMockAnalysis(type, description);
  }
}

/**
 * Generate a briefing summary for first responders
 */
export async function generateBriefing(incident) {
  const ai = getModel();
  
  if (!ai) {
    return `BRIEFING: ${incident.type?.toUpperCase()} incident at ${incident.location?.building || 'venue'}, Floor ${incident.location?.floor || '?'}. ${incident.description || 'Details pending.'}. ${incident.assignedStaff?.length || 0} staff responding. Status: ${incident.status}.`;
  }

  try {
    const prompt = `Generate a concise first-responder briefing (3-4 sentences) for this incident:
Type: ${incident.type}
Description: ${incident.description}
Location: ${incident.location?.building}, Floor ${incident.location?.floor}, ${incident.location?.zone}
Status: ${incident.status}
Staff responding: ${incident.assignedStaff?.length || 0}
Timeline events: ${incident.timeline?.map(t => t.event).join('; ')}

Write a clear, actionable briefing for an arriving first responder.`;

    const result = await ai.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Briefing generation error:', error);
    return `Active ${incident.type} incident at ${incident.location?.building || 'venue'}. ${incident.description}`;
  }
}

/**
 * Check if two incident reports might be duplicates
 */
export async function checkDuplicate(newReport, existingIncidents) {
  const ai = getModel();
  
  if (!ai || existingIncidents.length === 0) {
    return { isDuplicate: false, matchedIncidentId: null };
  }

  try {
    const existingList = existingIncidents.map(i => 
      `ID: ${i.id}, Type: ${i.type}, Location: Floor ${i.location?.floor} ${i.location?.zone}, Description: ${i.description?.substring(0, 100)}`
    ).join('\n');

    const prompt = `Compare this new report with existing active incidents. Respond in JSON only.

NEW REPORT:
Type: ${newReport.type}
Location: Floor ${newReport.location?.floor} ${newReport.location?.zone}
Description: ${newReport.description}

EXISTING ACTIVE INCIDENTS:
${existingList}

Respond: {"isDuplicate": true/false, "matchedIncidentId": "ID or null", "confidence": 0.0-1.0, "reason": "brief explanation"}`;

    const result = await ai.generateContent(prompt);
    const text = result.response.text().replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    return { isDuplicate: false, matchedIncidentId: null };
  }
}

// === Fallback mock analysis ===
function getMockAnalysis(type, description) {
  const severityMap = {
    fire: { severity: 'critical', confidence: 0.94 },
    medical: { severity: 'high', confidence: 0.91 },
    security: { severity: 'medium', confidence: 0.85 },
    natural_disaster: { severity: 'high', confidence: 0.88 },
    other: { severity: 'medium', confidence: 0.75 },
  };

  const actionsMap = {
    fire: [
      'Evacuate affected floor immediately',
      'Activate fire suppression system',
      'Alert local fire department',
      'Block access to affected zone',
      'Prepare medical team on standby',
    ],
    medical: [
      'Deploy medical team with AED',
      'Call emergency medical services (911)',
      'Clear path for medical response',
      'Prepare guest medical information if available',
      'Ready transport to nearest hospital',
    ],
    security: [
      'Dispatch security team to location',
      'Review CCTV footage',
      'Secure affected area perimeter',
      'Alert local law enforcement if needed',
      'Document all observations',
    ],
    natural_disaster: [
      'Activate disaster response protocol',
      'Begin guest evacuation if necessary',
      'Secure building utilities',
      'Open emergency communication channels',
      'Coordinate with local emergency services',
    ],
    other: [
      'Assess situation severity on-site',
      'Deploy nearest available staff',
      'Document the incident',
      'Monitor for escalation',
      'Notify management',
    ],
  };

  const base = severityMap[type] || severityMap.other;
  const descLen = (description || '').length;
  
  return {
    ...base,
    summary: `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} incident reported. AI analysis suggests ${base.severity} severity response protocol. ${descLen > 50 ? 'Detailed report indicates potential escalation risk.' : 'Limited details provided — on-site assessment recommended.'}`,
    suggestedActions: actionsMap[type] || actionsMap.other,
    estimatedResponseTime: base.severity === 'critical' ? '1-2 minutes' : base.severity === 'high' ? '2-4 minutes' : '5-10 minutes',
    riskFactors: ['Potential for escalation', 'Guest safety at risk'],
    requiredDepartments: type === 'fire' ? ['fire_safety', 'security', 'medical'] :
                         type === 'medical' ? ['medical', 'security'] :
                         type === 'security' ? ['security'] : ['maintenance', 'security'],
  };
}
