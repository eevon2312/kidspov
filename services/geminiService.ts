import { GoogleGenAI, Modality } from '@google/genai';
import type { RecognitionResult, PronunciationResult } from '../types';

export const identifyObjectAndTranslate = async (ai: GoogleGenAI, base64Image: string): Promise<RecognitionResult> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };

  const prompt = `You are an AI for 'Povkids', a language learning app. 
  1. Analyze this image and identify the main, most obvious object. 
  2. Respond with ONLY a valid JSON object. 
  3. The JSON object must have:
     - 'identifiedObject': The English name of the object.
     - 'translations': A dictionary where keys are language codes and values are the translation.
  
  Language codes to support:
  en-US (English), es-ES (Spanish), zh-CN (Chinese), ms-MY (Malay), hi-IN (Hindi), ar-XA (Arabic), fr-FR (French), pt-BR (Portuguese), ru-RU (Russian), ja-JP (Japanese), de-DE (German).

  Example Response format:
  {
    "identifiedObject": "Apple",
    "translations": {
        "en-US": "Apple",
        "es-ES": "Manzana",
        "zh-CN": "苹果",
        "ms-MY": "Epal",
        "hi-IN": "सेब",
        "ar-XA": "تفاحة",
        "fr-FR": "Pomme",
        "pt-BR": "Maçã",
        "ru-RU": "Яблоко",
        "ja-JP": "りんご",
        "de-DE": "Apfel"
    }
  }
  
  If you cannot identify a clear object, respond with: {"translations": null, "identifiedObject": null}
  Do not wrap your response in markdown backticks.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
  });

  let text = response.text.trim();
  if (text.startsWith('```json')) {
    text = text.substring(7, text.length - 3).trim();
  } else if (text.startsWith('```')) {
    text = text.substring(3, text.length - 3).trim();
  }
  
  try {
    const result = JSON.parse(text);
    return result as RecognitionResult;
  } catch(e) {
    console.error("Failed to parse JSON from Gemini response:", text);
    throw new Error("Received an invalid response from the AI.");
  }
};

export const generateSpeech = async (ai: GoogleGenAI, text: string, voice: string): Promise<string> => {
    const prompt = `Please say the following: ${text}`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice },
              },
          },
        },
      });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
        throw new Error("Could not generate audio.");
    }

    return base64Audio;
};

export const evaluatePronunciation = async (ai: GoogleGenAI, audioBase64: string, targetWord: string, language: string): Promise<PronunciationResult> => {
    const prompt = `The user (a child/teen) is trying to pronounce the word "${targetWord}" in ${language}. 
    Listen to the audio. 
    Rate their pronunciation on a scale of 1 to 3:
    3 = Excellent / Perfect (Native-like or very clear)
    2 = Good / Understandable (Minor accent or slight error)
    1 = Try Again (Unclear or wrong word)

    Provide short, encouraging feedback (max 10 words) suitable for a child.
    
    Respond ONLY with valid JSON:
    { "score": number, "feedback": "string" }
    `;

    const audioPart = {
        inlineData: {
            mimeType: 'audio/wav', // Assuming raw recording is converted or handled as compatible type, usually webm/wav for Gemini
            data: audioBase64
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Multimodal model for Audio input -> Text output
        contents: { parts: [audioPart, { text: prompt }] }
    });

    let text = response.text.trim();
    if (text.startsWith('```json')) {
        text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('```')) {
        text = text.substring(3, text.length - 3).trim();
    }

    try {
        const result = JSON.parse(text);
        return result as PronunciationResult;
    } catch (e) {
        console.error("Failed to parse pronunciation score", text);
        // Fallback
        return { score: 2, feedback: "Good try! Let's do it again." };
    }
}
