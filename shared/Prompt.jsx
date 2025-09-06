export default {
    CALORIES_PROMPT :`Based on weight ,Height,Gender,Goal give me calories and proteins need daily.Consider Age as 28 in JSON format and follow the schema:
    { 
      calories:<>,
      protins:<>
      }`,
    GENERATE_RECIPE_PROMPT:`Depends on user instructions create 3 different Recipe variant with Recipe Name with Emoji,
    2 line description and main ingredient list in JSON format  with field recipeName, description,ingredients (without size ) only.Do not give me a text response`,
    GENERATE_FULL_RECIPE_PROMPT:`You are a recipe generator AI.  
      Based on the given recipeName and description, generate a complete recipe in JSON format only.  

      Requirements:  
      - Provide a short description of the dish.  
      - Return the recipeName exactly as provided.  
      - Add emoji icons for each ingredient in the icon field.  
      - List ingredients as objects containing icon, ingredient, and quantity.  
      - Calculate and return only the numeric value for calories (no units).  
      - Provide estimated cooking time in minutes as cookTime (numeric only).  
      - Suggest how many people it serves as serveTo (numeric only).  
      - Return a realistic image description as imagePrompt (string).  
      - Classify the recipe into one or more categories from:  
        ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink"].  
      - Provide a clear ordered list of steps to cook the dish.  
      - Output must be **valid JSON** and match the schema exactly.  
      - Do not include any extra text or explanations, only JSON.  

      Schema format:  
      {
        "description": "string",
        "recipeName": "string",
        "calories": "number",
        "category": ["string"],
        "cookTime": "number",
        "imagePrompt": "string",
        "ingredients": [
          {
            "icon": "string",
            "ingredient": "string",
            "quantity": "string"
          }
        ],
        "serveTo": "number",
        "steps": ["string"]
      }`

}
