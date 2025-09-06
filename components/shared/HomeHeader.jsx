import { View, Text , Image } from 'react-native'
import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

export default function HomeHeader() {
    const {user}=useContext(UserContext)
  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10,
        marginTop:10
    }}>
      <Image source={require('./../../assets/images/userIcon.png')} style={{
        width:50,
        height:50,
        borderRadius:99
      }}/> 
      <View>
        <Text style={{
            fontSize:20
        }}>Hello,👋</Text>
        <Text style={{
            fontSize:20,
            fontWeight:'bold'
        }}>{user?.name}</Text>
      </View>
    </View>
  )
}