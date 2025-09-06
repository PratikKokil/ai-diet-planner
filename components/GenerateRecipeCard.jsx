import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'

export default function GenerateRecipeCard() {
  return (
    <LinearGradient 
    colors={["blue","#8837ff"]}
    style={{
        marginTop:15,
        padding:15,
        borderRadius:10
    }}>
      <Text style={{
        color:"white",
        fontSize:23,
        fontWeight:'bold'
      }}>Need Meal Ideas?✨</Text>
      <Text style={{
        color:"white",
        fontSize:16,
        opacity:0.8 ,
        marginTop:7
      }}>Let Our AI generate personalized recipes just for you!</Text>
      <TouchableOpacity style={{
        backgroundColor:"white",
        padding:10,
        borderRadius:10,
        marginTop:10,
        width:180,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:7
      }}>
        <Text style={{
            fontSize:18,
            color:"#8837ff",
        }}>Generate with AI</Text>
        <HugeiconsIcon icon={ArrowRight02Icon} color="#8837ff" size={20} />
        </TouchableOpacity>
    </LinearGradient>
  )
}