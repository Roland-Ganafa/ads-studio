// FIX: Removed `VideosOperation` from import as it is not an exported member of '@google/genai'.
import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import type { UploadedImage, GeneratedAdResult } from '../types';

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }
  return ai;
};

export async function generateAdImage(
  image: UploadedImage,
  basePrompt: string,
  adCopy: string
): Promise<GeneratedAdResult> {
  const finalPrompt = `${basePrompt}${adCopy ? `\n\nPlease prominently and creatively incorporate the following text into the ad: "${adCopy}"` : ''}`;

  try {
    const aiClient = getAI();
    const response: GenerateContentResponse = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            text = part.text;
          } else if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          }
        }
    }

    if (!imageUrl) {
        throw new Error("API did not return an image. It may have been blocked due to safety policies.");
    }

    // FIX: Updated returned object properties to match the `GeneratedAdResult` type.
    return { generatedImage: imageUrl, generatedText: text };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate ad image. Please try again.');
  }
}

export async function generateAdVideo(
  image: UploadedImage,
  basePrompt: string,
  adCopy: string
): Promise<GeneratedAdResult> {
  const finalPrompt = `${basePrompt}${adCopy ? `\n\nOverlay the following text creatively during the video: "${adCopy}"` : ''}`;
  const aiClient = getAI();

  try {
    // FIX: The explicit type `VideosOperation` was removed to fix the import error, allowing TypeScript to infer the type.
    let operation = await aiClient.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: finalPrompt,
      image: {
        imageBytes: image.base64,
        mimeType: image.mimeType,
      },
      config: {
        numberOfVideos: 1
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
      operation = await aiClient.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error("Video generation completed, but no download link was found.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    const videoUrl = URL.createObjectURL(videoBlob);

    // FIX: Updated returned object property to match the `GeneratedAdResult` type.
    return { generatedVideoUrl: videoUrl };

  } catch (error) {
    console.error('Error calling Gemini Video API:', error);
    throw new Error('Failed to generate ad video. This can take a few minutes. Please try again.');
  }
}

export async function suggestAdCopy(image: UploadedImage): Promise<string[]> {
  const aiClient = getAI();
  const prompt = "Based on the provided image of a product, generate 5 short, catchy, and effective advertising slogans or headlines. The slogans should be diverse in tone, from playful to sophisticated. Return the response as a JSON array of strings.";
  
  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { data: image.base64, mimeType: image.mimeType }},
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogans: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['slogans']
        },
      }
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    if (result && Array.isArray(result.slogans)) {
        return result.slogans;
    }
    return [];

  } catch (error) {
    console.error('Error suggesting ad copy:', error);
    throw new Error('Failed to suggest ad copy. The model may be unable to process the request.');
  }
}