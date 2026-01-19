
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Model, UploadedImage, AspectRatio } from '../types';

// This function creates a new GoogleGenAI instance on demand,
// ensuring it always uses the latest API key from the environment.
const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY environment variable not set. The app may not function correctly.");
        // Return a client with a placeholder key to avoid crashing, but API calls will fail.
        return new GoogleGenAI({ apiKey: 'MISSING_API_KEY' });
    }
    return new GoogleGenAI({ apiKey });
};

const extractImageFromResponse = (response: GenerateContentResponse): string | null => {
    if (!response.candidates || response.candidates.length === 0) {
        return null;
    }
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    return null;
}

export const generateImageFromPrompt = async (prompt: string, model: Model, aspectRatio: AspectRatio): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
            return imageUrl;
        } else {
            throw new Error("Не удалось извлечь изображение из ответа API.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};

export const editImageWithPrompt = async (prompt: string, image: UploadedImage, model: Model, aspectRatio: AspectRatio): Promise<string> => {
     try {
        const ai = getAiClient();
        const imagePart = {
            inlineData: {
                data: image.base64,
                mimeType: image.mimeType,
            },
        };

        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                 imageConfig: {
                    aspectRatio: aspectRatio,
                },
            },
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
            return imageUrl;
        } else {
            throw new Error("Не удалось извлечь отредактированное изображение из ответа API.");
        }
    } catch (error) {
        console.error("Error editing image:", error);
        throw error;
    }
};
