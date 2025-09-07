import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import { UserContext } from '../context/UserContext'
import { useConvex } from 'convex/react'
import { api } from '../convex/_generated/api'
import { RefreshDataContext } from '../context/RefreshDataContext'

export default function TodayProgress() {
    const {user}=useContext(UserContext)
    const convex=useConvex();
    const [totalCaloriesConsumed,setTotalCaloriesConsumed]=useState(0);
      const{refreshData,setRefreshData}=useContext(RefreshDataContext)

    useEffect(()=>{
        user&&GetTotalCaloriesConsumed()
    },[user,refreshData ])

    const GetTotalCaloriesConsumed=async()=>{
      const result=await convex.query(api.MealPlan.GetTotalCaloriesConsumed, {
        date: moment().format('YYYY-MM-DD'),
        uid: user?._id
      })
      setTotalCaloriesConsumed(result)
    }
  return (
    <View style={{
        marginTop:20,
        padding:15,
        backgroundColor:"white",
        borderRadius:10
            
    }}>
        <View style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',

        }}>
        <Text style={{
            fontSize:20,
            fontWeight:'bold'
        }}>Today's Goal</Text>
        <Text style={{
            fontSize:18 
        }}>{moment().format('MMM DD,yyyy')}</Text>
        </View>
        <Text style={{
            fontSize:30,
            fontWeight:'bold',
            marginTop:10,
            textAlign:'center',
            color:"#8837ff"
        }}>{totalCaloriesConsumed}/{user?.calories} kcal</Text>
        <Text style={{
            textAlign:'center',
            marginTop:2,
            fontSize:16
        }}>You'r doing great!</Text>
        <View style={{
            backgroundColor:"gray",
            height:10,
            borderRadius:99,
            marginTop:15,
            opacity:0.7
        }}>
            <View style={{
                backgroundColor:"#8837ff",
                height:10,
                borderRadius:99,
                width:"70%",
                }}>

            </View>
        </View>
        <View style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:10
        }}>
            <Text>Calories Consumes</Text>
            <Text>Keep it up! 🔥</Text>
        </View>
    </View>

  )
}