import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeLegalIssue = async (question: string) => {
  if (!ai) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert Indian legal assistant AI called Apna-Lawyer.
Analyze the user's legal issue:
User Issue: ${question}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, description: "LOW | MEDIUM | HIGH | CRITICAL" },
          case_type: { type: Type.STRING },
          simple_summary: { type: Type.STRING, description: "A very simple, 1-sentence summary for quick understanding" },
          explanation: { type: Type.STRING },
          laws: { type: Type.ARRAY, items: { type: Type.STRING } },
          court_guidance: {
            type: Type.OBJECT,
            properties: {
              step_by_step: { type: Type.ARRAY, items: { type: Type.STRING } },
              documents_required: { type: Type.ARRAY, items: { type: Type.STRING } },
              where_to_go: { type: Type.ARRAY, items: { type: Type.STRING } },
              timeline: { type: Type.STRING },
              cost_estimate: { type: Type.STRING },
              risk_level: { type: Type.STRING }
            },
            required: ["step_by_step", "documents_required", "where_to_go", "timeline", "cost_estimate", "risk_level"]
          },
          case_timeline: {
            type: Type.OBJECT,
            properties: {
              current_stage: { type: Type.STRING },
              next_step: { type: Type.STRING },
              expected_next_hearing: { type: Type.STRING },
              typical_duration: { type: Type.STRING },
              court_process_flow: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["current_stage", "next_step", "expected_next_hearing", "typical_duration", "court_process_flow"]
          },
          disclaimer: { type: Type.STRING }
        },
        required: ["severity", "case_type", "simple_summary", "explanation", "laws", "court_guidance", "case_timeline", "disclaimer"]
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    throw new Error("Failed to analyze case. Please try again.");
  }
};

export const analyzeDocument = async (extractedText: string) => {
  if (!ai) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this legal document and return valid JSON:
${extractedText.slice(0, 5000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          key_legal_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          next_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          document_type: { type: Type.STRING }
        },
        required: ["summary", "key_legal_points", "risks", "next_steps", "document_type"]
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    throw new Error("Failed to analyze document.");
  }
};

export const improveDocument = async (draftText: string) => {
  if (!ai) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Improve this legal document to be more formal and legally precise. Return only the improved document text, no JSON:
${draftText}`,
  });

  return response.text;
};

export const generateFIR = async (caseDetails: any) => {
  if (!ai) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a formal First Information Report (FIR) draft for the following case in the Indian legal format. 
Case Type: ${caseDetails.case_type}
Severity: ${caseDetails.severity}
Details: ${caseDetails.explanation}
Laws: ${caseDetails.laws.join(", ")}

Return only the FIR text. No preamble, no markdown formatting like triple backticks.`,
  });

  return response.text;
};

export const generateLegalNotice = async (caseDetails: any) => {
  if (!ai) throw new Error("Gemini API key not configured");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a formal Legal Notice draft for the following case in the Indian legal format.
Case Type: ${caseDetails.case_type}
Severity: ${caseDetails.severity}
Details: ${caseDetails.explanation}
Laws: ${caseDetails.laws.join(", ")}

Return only the Legal Notice text. No preamble, no markdown formatting like triple backticks.`,
  });

  return response.text;
};
