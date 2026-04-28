"use server";

import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ingredientSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    ingredients: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { 
            type: SchemaType.STRING,
            description: "Lowercase name of the food item"
          },
          confidence: { 
            type: SchemaType.NUMBER,
            description: "Certainty score between 0.0 and 1.0"
          }
        },
        required: ["name", "confidence"]
      }
    }
  },
  required: ["ingredients"],
};

export async function detectIngredients(images: { base64: string; type: string }[]) {

  const parts = images.map(img => ({
    inlineData: {
      data: img.base64,
      mimeType: img.type,
    },
  }))

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a professional kitchen inventory assistant. Your task is to identify raw ingredients and food items from images. 
      Be concise and only list items you are sure are present.`,
      generationConfig: { 
          responseMimeType: "application/json", 
          responseSchema: ingredientSchema 
      },
    })

    const prompt = `
      Look at the fridge image carefully.

      Scan the fridge systematically from:
      1. top shelf
      2. middle shelf
      3. bottom shelf
      4. door compartments
      5. drawers

      For each area:
      - identify clearly visible food or drink items
      - use common ingredient names
      - do NOT guess items that are not clearly visible

      After scanning all areas:
      - combine the items into one list
      - remove duplicates
      - format names in lowercase
    Then:

    Return a JSON object with an 'ingredients' array. 
    Each ingredient must have a 'name' (lowercase) and a 'confidence' score (0.0 to 1.0).

    Confidence rules:
    - 1.0: Crystal clear, unmistakable.
    - 0.8: Highly likely, but slightly blurry.
    - 0.5: Obstructed view or generic packaging.
    - Below 0.5 = poor visibility`

    const result = await model.generateContent([...parts, prompt])
    const responseText = result.response.text();

    console.log("[AI SCAN] Received Response:")
    console.log(responseText)
    console.log("-----------------------------------")

    return JSON.parse(responseText)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("GEMINI API ERROR:", error.message)
    } else {
      console.error("An unexpected error occurred", error)
    }
    
    throw new Error("AI failed to process image. Please try again.")
  }
}

export async function verifyIngredients(images: { base64: string; type: string }[], currentList: string[]) {

  const parts = images.map(img => ({
    inlineData: {
      data: img.base64,
      mimeType: img.type,
    },
  }))

  try{
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are a skeptical auditor. You verify the work of other AIs to ensure accuracy and prevent hallucinations.",
      generationConfig: { responseMimeType: "application/json", responseSchema: ingredientSchema },
    })

    const prompt = `A previous scan suggested these items are in the fridge: ${currentList.join(", ")}.
    Look at the image again carefully.
    Tasks:
    1. Remove any items that are NOT clearly visible in the image.
    2. Add items ONLY if they are clearly visible.
    3. Do not guess ingredients based on packaging or context.
    4. Return a deduplicated list of ingredient names in lowercase.
      
    Then:

    Return a JSON object with an 'ingredients' array. 
    Each ingredient must have a 'name' (lowercase) and a 'confidence' score (0.0 to 1.0).

    Confidence rules:
    - 1.0: Crystal clear, unmistakable.
    - 0.8: Highly likely, but slightly blurry.
    - 0.5: Obstructed view or generic packaging.
    - Below 0.5 = poor visibility`

    const result = await model.generateContent([...parts, prompt]);
    const responseText = result.response.text()

    console.log("[AI VERIFY]", responseText);

    return JSON.parse(responseText)
  } catch (error: unknown) {
     if (error instanceof Error) {
      console.error("GEMINI API ERROR:", error.message)
    } else {
      console.error("An unexpected error occurred", error)
    }
    
    throw new Error("AI failed to process image. Please try again.")
  }
}