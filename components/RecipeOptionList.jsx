import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import Prompt from '../shared/Prompt'
import { generateAIRecipe, GenerateRecipeImage } from '../services/AiModel';
import Loadingdialog from './Loadingdialog';
import {useMutation} from 'convex/react'
import { api } from '../convex/_generated/api';
import UserContext from './../context/UserContext'
import { useRouter } from 'expo-router';

export default function RecipeOptionList({recipeOption}) {
    const [loading,setLoading]=React.useState(false);
    const CreateRecipe=useMutation(api.Recipes.CreateRecipe);
    const {user}=useContext(UserContext);
    const router = useRouter()
    const onRecipeOptionSelect=async(recipe)=>{  
        setLoading(true);
       const PROMPT = "Recipe Name: "+recipe?.recipeName +". Description: "+recipe?.description +". "+Prompt.GENERATE_FULL_RECIPE_PROMPT;
       try {
        const result = await generateAIRecipe(PROMPT);
        const extractJson=result.choices[0].message.content.replace('```json','').replace('```','')
        const parsedJSONResp=JSON.parse(extractJson);
        console.log("Full Recipe",parsedJSONResp);

        const aiImageResp=await GenerateRecipeImage(parsedJSONResp?.imagePrompt);
        const saveRecipeResult = await CreateRecipe({
            jsonData:parsedJSONResp,
            imageUrl:aiImageResp?.data?.image,
            recipeName:parsedJSONResp?.recipeName,
            uid:user?._id
        })
        setLoading(false);
        router.push({
            pathname:'/recipe-detail',
            recipeId:saveRecipeResult
        })
        
       } catch (error) {
         setLoading(false);
       }
       
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
      <Loadingdialog loading={loading} />
    </View>
  )
}