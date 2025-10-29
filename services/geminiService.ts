import { GoogleGenAI, Modality } from '@google/genai';
import type { RecognitionResult } from '../types';

export const identifyObjectAndTranslate = async (ai: GoogleGenAI, base64Image: string): Promise<RecognitionResult> => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };

  const prompt = `You are an AI for a kids' learning app. Analyze this image and identify the main, most obvious object. Respond with ONLY a valid JSON object. The JSON object should have a key 'translations' which contains key-value pairs of language codes and the translated name of the object. The language codes are: en (English), zh (Mandarin Chinese), ms (Malay), es (Spanish), nl (Dutch), th (Thai). For example, if the image is an apple, respond with:
  {"translations": {"en": "apple", "zh": "苹果", "ms": "epal", "es": "manzana", "nl": "appel", "th": "แอปเปิ้ล"}}
  If you cannot identify a clear object, respond with: {"translations": null}
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