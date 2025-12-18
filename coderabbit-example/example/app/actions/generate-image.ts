"use server";

import { z } from "zod";

// Schema for form validation
export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500, "Prompt must be less than 500 characters"),
  style: z.string().optional(),
  width: z.number().min(256).max(1024).default(512),
  height: z.number().min(256).max(1024).default(512),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;

export type GenerateImageResult = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

/**
 * Mock server action for AI image generation
 * In a real implementation, this would call an AI image generation API
 */
export async function generateImage(
  input: GenerateImageInput
): Promise<GenerateImageResult> {
  try {
    // Validate input
    const validatedInput = generateImageSchema.parse(input);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response - in a real implementation, this would be:
    // const response = await fetch('https://api.example.com/generate-image', {
    //   method: 'POST',
    //   body: JSON.stringify(validatedInput),
    // });
    // const data = await response.json();
    // return { success: true, imageUrl: data.imageUrl };

    // Mock successful response with a placeholder image URL
    const mockImageUrl = `https://placehold.co/${validatedInput.width}x${validatedInput.height}/6366f1/ffffff?text=${encodeURIComponent(validatedInput.prompt.substring(0, 20))}`;

    return {
      success: true,
      imageUrl: mockImageUrl,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation error",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}

