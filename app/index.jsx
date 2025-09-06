import { useRouter } from "expo-router";
import { Dimensions, Image, Text, View } from "react-native";
import Button from "../components/shared/Button";
export default function Index() {
  const router=useRouter();
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Image
      source={require("./../assets/images/landingscreen.jpg")}
      style={{
        width:"100%",
        height:Dimensions.get('screen').height
      }}
      />
      <View style={{
        position:"absolute",
        height:Dimensions.get('screen').height,
        backgroundColor:'#0707075e',
        width:"100%",
        display:"flex",
        alignItems:"center",
        padding:10
      }}>
        <Image source={require("./../assets/images/finallogo.png")}
        style={{
          width:200,
          height:200,
          resizeMode: "contain", // keeps proportions
          backgroundColor: "transparent",
          marginTop:100
        }}
        />
        <Text style={{
          color:"white",
          fontWeight:"bold",
          fontSize:30
        }}>
         AI Diet Planner
        </Text>
        <Text
        style={{
          color:"white",
          textAlign:"center",
          marginHorizontal:20,
          fontSize:20,
          marginTop:15,
          opacity:0.8
        }}>
          Smart meals. Healthy life
        </Text>
        
      </View>
      <View style={{
        position:"absolute",
        width:"100%",
        bottom:50,
        padding:20
      }}>
        <Button 
        title={"Get Started"} 
        onPress={()=>router.push('/auth/SignIn')}/>
        
      </View>


    </View>
  );
}
