import { View, Text, Image, TextInput, Alert} from "react-native";
import React, { useContext, useState } from "react";
import Button from "../../components/shared/Button";
import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FirebaseConfig";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserContext } from "../../context/UserContext";
export default function SignIn() {
        const [email,setEmail]=useState();
        const [password,setPassword]=useState();
        const convex = useConvex();
        const {user,setUser}=useContext(UserContext);
    const onSignIn=()=>{
        if(!email || !password){
            
            Alert.alert("Please fill all the fields");
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userData=await convex.query(api.Users.GetUser,{
                email:email
            })
            console.log("Signed in:",user);
            console.log(userData);
            setUser(userData);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage);
        });
    }
  return (
    <View
        style={{padding:20,flex:1}}
    >
    <View
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./../../assets/images/finallogo.png")}
        style={{
          width: 200,
          height: 200,
          marginTop: 60,
          resizeMode: "contain",
          backgroundColor: "transparent",
        }}
      />
      <Text
        style={{
          fontSize: 35,
          fontWeight: "bold",
          marginVertical: 20,
        }}
      >
        Welcome Back
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        style={{
          width: "80%",
          padding: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: "80%",
          padding: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 20,
        }}
      />
      
    </View>
    <View style={{
        marginTop:15,
        width:"100%"
    }}>
       <Button title={'Sign In'} onPress={onSignIn}> </Button>
       <Text style={{
        textAlign:"center",
        fontSize:16,
        marginTop:15
       }}> Do not have an account?</Text>
       <Link href={'/auth/SignUp'}>
        <Text style={{
        textAlign:"center",
        fontSize:16,
        marginTop:5,
        fontWeight:"bold"
        }}>Create New Account</Text>
       </Link>
    </View>
    </View>

  );
}
