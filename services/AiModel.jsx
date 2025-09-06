import axios from "axios";
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

const BASE_URL='https://aigurulab.tech';
export const GenerateRecipeImage=async(prompt) => await axios.post(BASE_URL+'/api/generate-image',
        {
            width: 1024,
            height: 1024,
            input: prompt,
            model: 'sdxl',
            aspectRatio:"1:1"
        },
        {
            headers: {
                'x-api-key': process.env.EXPO_PUBLIC_AIRGURU_LAB_API_KEY, 
                'Content-Type': 'application/json', 
            },
        }
      )


