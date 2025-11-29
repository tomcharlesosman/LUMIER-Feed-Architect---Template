
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";
import { STYLE_PRESETS } from "../constants";

// Helper to convert File/Blob to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateProductFeed = async (
  productImages: File[],
  size: ImageSize,
  styleId: string
): Promise<string> => {
  // Always initialize a new instance to capture the latest API key selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Convert all images to parts
  const imageParts = await Promise.all(productImages.map(async (file) => ({
    inlineData: {
      mimeType: file.type,
      data: await fileToGenerativePart(file)
    }
  })));

  // Get the style prompt or fallback to NATURAL if not found
  const styleConfig = STYLE_PRESETS[styleId] || STYLE_PRESETS.NATURAL;
  
  const noun = productImages.length > 1 ? "these products" : "this product";

  const prompt = `Create a 9-image Instagram feed for ${noun} ${styleConfig.prompt} The feed must use different locations, angles, and compositions while maintaining a cohesive visual style. The output must be a single high-resolution grid image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
          ...imageParts
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1", // Grid is usually square
        },
      },
    });

    // Extract image
    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image generated.");
    }

    return imageUrl;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};