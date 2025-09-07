import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import Prompt from '../shared/Prompt'
import { generateAIRecipe, GenerateRecipeImage } from '../services/AiModel';
import Loadingdialog from './Loadingdialog';
import {useMutation} from 'convex/react'
import { api } from '../convex/_generated/api';
import { UserContext } from './../context/UserContext'
import { useRouter } from 'expo-router';

export default function RecipeOptionList({recipeOption}) {
    const [loading,setLoading]=useState(false);
    const [error, setError] = useState(null);
    const CreateRecipe=useMutation(api.Recipes.CreateRecipe);
    const {user}=useContext(UserContext);
    const router = useRouter()
    
    const onRecipeOptionSelect=async(recipe)=>{  
        setLoading(true);
        setError(null); // Clear any previous errors
        const PROMPT = "Recipe Name: "+recipe?.recipeName +". Description: "+recipe?.description +". "+Prompt.GENERATE_FULL_RECIPE_PROMPT;
        
        try {
            const result = await generateAIRecipe(PROMPT);
            
            // Check if API returned an error
            if (!result || !result.choices || !result.choices[0]) {
                throw new Error('Failed to generate recipe. Please try again.');
            }

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
            
            router.push({
                pathname:'/recipe-detail',
                params: { recipeId: saveRecipeResult }
            })
            
        } catch (error) {
            console.error('Error creating recipe:', error);
            
            // Set user-friendly error messages based on error type
            let errorMessage = "Something went wrong while generating your recipe. Please try again.";
            
            if (error.message && error.message.includes('API')) {
                errorMessage = "Our recipe service is temporarily unavailable. Please try again in a few moments.";
            } else if (error.message && error.message.includes('network')) {
                errorMessage = "Please check your internet connection and try again.";
            } else if (error.message && error.message.includes('quota')) {
                errorMessage = "We've reached our daily recipe generation limit. Please try again tomorrow.";
            }
            
            setError(errorMessage);
            
            // Also show an alert
            Alert.alert(
                "Recipe Generation Failed",
                errorMessage,
                [{ text: "OK", onPress: () => setError(null) }]
            );
            
        } finally {
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
            }}>Generated Ideas</Text>
            
            {/* Error Message Display */}
            {error && (
                <View style={{
                    backgroundColor: '#ffebee',
                    borderColor: '#f44336',
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 10,
                    marginBottom: 10
                }}>
                    <Text style={{
                        color: '#d32f2f',
                        fontSize: 14,
                        textAlign: 'center'
                    }}>
                        ⚠️ {error}
                    </Text>
                    <TouchableOpacity 
                        onPress={() => setError(null)}
                        style={{
                            alignSelf: 'center',
                            marginTop: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            backgroundColor: '#f44336',
                            borderRadius: 4
                        }}
                    >
                        <Text style={{
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 'bold'
                        }}>
                            Dismiss
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <View>
                {recipeOption?.map((item,index)=>(
                    <TouchableOpacity 
                        onPress={()=>{onRecipeOptionSelect(item)}}
                        key={index}
                        style={{
                            marginTop:15,
                            padding:15,
                            borderWidth:0.2,
                            borderRadius:15,
                            opacity: loading ? 0.6 : 1 // Dim when loading
                        }}
                        disabled={loading} // Disable during loading
                    >
                        <Text style={{
                            fontSize:16,
                            fontWeight:'bold'
                        }}>{item?.recipeName}</Text>
                        <Text style={{
                            fontSize:14,
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