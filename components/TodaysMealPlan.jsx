import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { CalendarAdd01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import  Button  from './shared/Button';
export default function TodaysMealPlan() {
    const [mealPlan,setMealPlan]=useState(null);
  return (
    <View style={{
        marginTop:15
    }}>
      <Text style={{
        fontSize:20,
        fontWeight:'bold'
      }}>Today's Meal Plan</Text>

      {!mealPlan && 
      <View style={{
        display:'flex',
        alignItems:'center',
        padding:20,
        backgroundColor:'white',
        borderRadius:15,
        marginTop:15
      }}>
        <HugeiconsIcon icon={CalendarAdd01Icon} size={40} color="#8837ff"/>
        <Text style={{
            fontSize:16,
            color:"grey",
            marginBottom: 20}}>You don't have any meal plan for today</Text>
            <Button title='Create Meal Plan' onPress={()=>{}}/>
      </View>
    }
    </View>
  )
}