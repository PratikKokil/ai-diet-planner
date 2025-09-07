import { View, Text, Image, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";   
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FirebaseConfig";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserContext } from "../../context/UserContext";
import { GenerateRecipeImage } from "../../services/AiModel";

export default function SignIn() {
  const [email, setEmail] = useState("pratik@gmail.com");
  const [password, setPassword] = useState("Pratik@123");
  const convex = useConvex();
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  //  useEffect(()=>{
  //   try {
  //      fetchData()
  //   } catch (error) {
  //     console.log(error)
  //   }
     
  //   },[])
  //   const fetchData=async()=>{
  //     const prompt="Caesar Salad dish"
  //     const aiImageResp=await GenerateRecipeImage(prompt);
  //     console.log(aiImageResp?.data?.image)
  //   }
    
  const onSignIn = () => {
    if (!email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userData = await convex.query(api.Users.GetUser, {
          email: email,
        });
        setUser(userData);
        router.replace("/(tabs)/Home");
      })
      .catch(() => {
        Alert.alert("Incorrect email or password", "Please try again");
      });
       
  };
  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View style={{ display: "flex", alignItems: "center" }}>
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

       
        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={{ marginTop: 15, width: "100%" }}>
        <Button title={"Sign In"} onPress={onSignIn} />

        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            marginTop: 15,
          }}
        >
          Do not have an account?
        </Text>
        <Link href={"/auth/SignUp"}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Create New Account
          </Text>
        </Link>
      </View>
    </View>
  );
}
