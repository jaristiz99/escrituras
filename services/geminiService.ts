import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ComparativeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    christianity: {
      type: Type.OBJECT,
      properties: {
        perspective: { type: Type.STRING, description: "Un resumen detallado de la visión cristiana basada en la Biblia." },
        core_beliefs: { type: Type.STRING, description: "Conceptos teológicos clave relacionados con el tema." },
        key_verses: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              citation: { type: Type.STRING, description: "ej., Mateo 5:3" },
              text: { type: Type.STRING, description: "El contenido del versículo." },
              context: { type: Type.STRING, description: "Breve contexto del versículo." }
            },
            required: ["citation", "text"]
          }
        }
      },
      required: ["perspective", "core_beliefs", "key_verses"]
    },
    judaism: {
      type: Type.OBJECT,
      properties: {
        perspective: { type: Type.STRING, description: "Un resumen detallado de la visión judía basada principalmente en la Torá (y Tanaj)." },
        core_beliefs: { type: Type.STRING },
        key_verses: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              citation: { type: Type.STRING, description: "ej., Deuteronomio 6:4" },
              text: { type: Type.STRING },
              context: { type: Type.STRING }
            },
            required: ["citation", "text"]
          }
        }
      },
      required: ["perspective", "core_beliefs", "key_verses"]
    },
    islam: {
      type: Type.OBJECT,
      properties: {
        perspective: { type: Type.STRING, description: "Un resumen detallado de la visión islámica basada en el Corán." },
        core_beliefs: { type: Type.STRING },
        key_verses: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              citation: { type: Type.STRING, description: "ej., Surah Al-Baqarah 2:255" },
              text: { type: Type.STRING },
              context: { type: Type.STRING }
            },
            required: ["citation", "text"]
          }
        }
      },
      required: ["perspective", "core_beliefs", "key_verses"]
    },
    synthesis: {
      type: Type.OBJECT,
      properties: {
        similarities: { type: Type.ARRAY, items: { type: Type.STRING } },
        differences: { type: Type.ARRAY, items: { type: Type.STRING } },
        conclusion: { type: Type.STRING }
      },
      required: ["similarities", "differences", "conclusion"]
    }
  },
  required: ["topic", "christianity", "judaism", "islam", "synthesis"]
};

export const analyzeTopic = async (topic: string): Promise<ComparativeAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Realiza un análisis teológico riguroso, objetivo y comparativo sobre el tema: "${topic}".
      
      Compara las perspectivas de:
      1. Cristianismo (La Biblia)
      2. Judaísmo (La Torá/Tanaj)
      3. Islam (El Corán)

      Para cada religión:
      - Proporciona un resumen detallado de la perspectiva.
      - Identifica creencias teológicas centrales relacionadas con el tema.
      - Cita versículos clave específicos (Libro Capítulo:Versículo para Biblia/Torá, Surah Número:Versículo para Corán). Cita el texto del versículo explícitamente.
      
      Finalmente, proporciona una síntesis comparando similitudes y diferencias.
      Mantén un tono académico y respetuoso. Responde ESTRICTAMENTE EN ESPAÑOL.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ComparativeAnalysis;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};