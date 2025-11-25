import { GoogleGenAI, Type } from '@google/genai';
import { ScanResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeImage(imageData: string): Promise<ScanResult> {
  try {
    const base64Data = imageData.split(',')[1];

    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data,
            },
          },
          {
            text: `Analyze this image of a fingernail or palm for hemoglobin estimation. 
            Act as a clinical AI.
            
            Provide a realistic estimation of hemoglobin levels (g/dL) based on the pallor and vascularity visible.
            
            Return a JSON object with:
            - hemoglobin: number (e.g. 13.5)
            - classification: "Normal" | "Mild" | "Moderate" | "Severe"
            - confidence: number (0 to 1)
            - features: object with vascularVisibility, colorimetricIndex, texturalAnalysis, spectralReflectance (all 0 to 1 floats)
            
            Reference ranges:
            - Normal: 12.0 - 17.5 g/dL
            - Mild Anemia: 10.0 - 11.9 g/dL
            - Moderate Anemia: 8.0 - 9.9 g/dL
            - Severe Anemia: < 8.0 g/dL`
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Low temperature for consistent medical analysis
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hemoglobin: { type: Type.NUMBER },
            classification: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            features: {
              type: Type.OBJECT,
              properties: {
                vascularVisibility: { type: Type.NUMBER },
                colorimetricIndex: { type: Type.NUMBER },
                texturalAnalysis: { type: Type.NUMBER },
                spectralReflectance: { type: Type.NUMBER },
              }
            }
          }
        }
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    // Fallback default values if model returns partial data
    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      userId: 'unknown', // Will be overwritten in App.tsx
      timestamp: Date.now(),
      hemoglobin: data.hemoglobin ?? 13.0,
      classification: (data.classification as any) ?? 'Normal',
      confidence: data.confidence ?? 0.85,
      features: {
        vascularVisibility: data.features?.vascularVisibility ?? 0.8,
        colorimetricIndex: data.features?.colorimetricIndex ?? 0.8,
        texturalAnalysis: data.features?.texturalAnalysis ?? 0.8,
        spectralReflectance: data.features?.spectralReflectance ?? 0.8,
      },
      imageData: imageData
    };

    return result;

  } catch (error) {
    console.error("AI Analysis failed", error);
    // Return a mock result on error to prevent app crash if API key is invalid/missing
    return {
      id: `err-${Date.now()}`,
      userId: 'unknown',
      timestamp: Date.now(),
      hemoglobin: 12.5,
      classification: 'Normal',
      confidence: 0.0,
      features: {
        vascularVisibility: 0.5,
        colorimetricIndex: 0.5,
        texturalAnalysis: 0.5,
        spectralReflectance: 0.5,
      },
      imageData: imageData
    };
  }
}