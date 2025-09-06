import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Button({title,onPress,loading}) {
  return (
    <TouchableOpacity 
    onPress={onPress}
    disabled={loading}
    style={{
        backgroundColor:"#8837ff",
        width:"100%",
        padding:13,
        borderRadius:10,
    }}>
     {loading ? <ActivityIndicator color="white" /> : 
     <Text
      style={{
        color:"white",
        fontSize:18,
        textAlign:'center'
      }}
      >{title}</Text>}
      
    </TouchableOpacity>
  )
}