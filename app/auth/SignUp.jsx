import { View, Text, Image, TextInput, Alert} from "react-native";
import React, { useContext, useState } from "react";
import Button from "../../components/shared/Button";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FirebaseConfig";
import { useMutation } from "convex/react";
import {api} from "../../convex/_generated/api"
import { UserContext } from "../../context/UserContext.jsx";
export default function SignUp() {

    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const createNewUser = useMutation(api.Users.createNewUser)
   const {user,setUser}=useContext(UserContext);
    const onSignUp=()=>{
        if(!name || !email || !password){
            Alert.alert("Please fill all the fields");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
            if(user){
                const result = await createNewUser({
                    name:name,
                    email:email,
            });
            console.log(result); 
            setUser(result);
        }
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
          marginVertical: 10,
        }}
      >
        Create New Account
      </Text>
       <TextInput
        placeholder="Full Name"
        placeholderTextColor="#999"
        onChangeText={setName}
        style={{
          width: "80%",
          padding: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 15,
        }}
      />
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
       <Button title={'Create Account'} onPress={onSignUp}> </Button>
       <Text style={{
        textAlign:"center",
        fontSize:16,
        marginTop:15
       }}> Already have an account?</Text>
       <Link href={'/auth/SignIn'}>
        <Text style={{
        textAlign:"center",
        fontSize:16,
        marginTop:5,
        fontWeight:"bold"
        }}>Sign In here</Text>
       </Link>
    </View>
    </View>

  );
}
