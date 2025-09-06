import { View, Text, Image, Alert } from "react-native";
import React, { useContext, useState } from "react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";   
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FirebaseConfig";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserContext } from "../../context/UserContext.jsx";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createNewUser = useMutation(api.Users.createNewUser);
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const onSignUp = () => {
    
    if (!name || !email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          const result = await createNewUser({
            name: name,
            email: email,
          });
          setUser(result);
        router.replace("/(tabs)/Home");
        }
      })
      .catch((error) => {
        console.log(error.code, error.message);
        Alert.alert("Sign Up Failed", "Something went wrong. Please try again.");
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
            marginVertical: 10,
          }}
        >
          Create New Account
        </Text>

        {/* ✅ Reusable Inputs */}
        <Input
          label="Full Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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
        <Button title={"Create Account"} onPress={onSignUp} />

        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            marginTop: 15,
          }}
        >
          Already have an account?
        </Text>
        <Link href={"/auth/SignIn"}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 5,
              fontWeight: "bold",
            }}
          >
            Sign In here
          </Text>
        </Link>
      </View>
    </View>
  );
}
