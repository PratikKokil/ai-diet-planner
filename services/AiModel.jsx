import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_APP_KEY,

})

export   const CalculateCaloriesAI =async(PROMT)=> await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      { role: "user", content: PROMT}
    ],
    response_format:"json_object"
  })

export   const generateAIRecipe =async(PROMT)=> await openai.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      { role: "user", content: PROMT}
    ],
    response_format:"json_object"
  })

  // export const response = await ai.models.generateContent({
  //   model: "gemini-2.5-flash",
  //   contents: "Explain how AI works in a few words",
  // });


