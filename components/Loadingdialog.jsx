import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator, Modal } from 'react-native-web'

export default function Loadingdialog({loading}) {
  return (
   <Modal transparent visible={loading}>
     <View style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#00000070'
     }}>
        <View style={{
            padding:20,
            borderRadius:15,
            backgroundColor:"#8837ff",
            alignItems:'center'
        }}>
            <ActivityIndicator size="large" color="white" />
            <Text styles={{
                color:"white",
                marginTop:8,
                fontSize:18
            }}>Loading...</Text>
        </View>
     </View>
   </Modal>
  )
}