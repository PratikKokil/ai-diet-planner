import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Button({title,onPress}) {
  return (
    <TouchableOpacity 
    onPress={onPress}
    style={{
        backgroundColor:"#8837ff",
        width:"100%",
        padding:15,
        borderRadius:10,
    }}>
      <Text
      style={{
        color:"white",
        fontSize:20,
        textAlign:'center'
      }}
      >{title}</Text>
    </TouchableOpacity>
  )
}