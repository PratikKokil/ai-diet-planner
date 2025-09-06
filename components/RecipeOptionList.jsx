import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Prompt from '../shared/Prompt'
import { generateAIRecipe } from '../services/AiModel';
import Loadingdialog from './Loadingdialog';

export default function RecipeOptionList({recipeOption}) {
    const onRecipeOptionSelect=async(recipe)=>{  
       const PROMPT = "Recipe Name: "+recipe?.recipeName +". Description: "+recipe?.description +". "+Prompt.GENERATE_FULL_RECIPE_PROMPT;
       const result = await generateAIRecipe(PROMPT);
        const extractJson=result.choices[0].message.content.replace('```json','').replace('```','')
        const parsedJSONResp=JSON.parse(extractJson);
        console.log("Full Recipe",parsedJSONResp)
      }

  return (
    <View style={{
        marginTop:20
    }}>
      <Text style={{
        fontSize:20,
        fontWeight:'bold',
        // marginBottom:10
      }}>Select Recipe</Text>
      <View>
        {recipeOption?.map((item,index)=>(
            <TouchableOpacity 
            onPress={()=>{onRecipeOptionSelect(item)}}
             key={index}style={{
                marginTop:15,
                padding:15,
                borderWidth:0.2,
                borderRadius:15
            }}>
                <Text style={{
                    fontsize:16,
                    fontWeight:'bold'
                }}>{item?.recipeName}</Text>
                <Text style={{
                    fontsize:14,
                    color:'gray',
                }}>
                    {item?.description}
                </Text>
            </TouchableOpacity>
        ))}
      </View>
      <Loadingdialog loading={true} />
    </View>
  )
}