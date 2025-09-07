import { View, Text,FlatList } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'
import { useRouter } from 'expo-router';
import HomeHeader from '../../components/shared/HomeHeader';
import TodayProgress from '../../components/TodayProgress';
import GenerateRecipeCard from '../../components/GenerateRecipeCard';
import TodaysMealPlan from '../../components/TodaysMealPlan';

export default function Home() {
    const {user}=useContext(UserContext);
    const router = useRouter();
    useEffect(()=>{
      if(user && !user?.weight){
        router.replace('/preferance')
      }
    },[user])
  return (
    <FlatList
    data={[]}
    renderItem={()=>null}
    ListHeaderComponent={
    
    <View style={{
      padding:20,
      paddingTop:25 }}>
      <HomeHeader/>
      <TodayProgress/>
      <GenerateRecipeCard/>
      <TodaysMealPlan/>
    </View>}
    >
    </FlatList>
  )
}