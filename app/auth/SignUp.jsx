import { View, Text, Image, Alert, ActivityIndicator } from "react-native";
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
  const [loading, setLoading] = useState(false);

  const createNewUser = useMutation(api.Users.createNewUser);
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const onSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }

    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
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

        <Input
          label="Full Name"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Input
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={{ marginTop: 15, width: "100%" }}>
        <Button 
          title={loading ? "Creating Account..." : "Create Account"} 
          onPress={onSignUp}
          disabled={loading}
        />

        {loading && (
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 10 
          }}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={{ marginLeft: 8, color: '#666' }}>
              Setting up your account...
            </Text>
          </View>
        )}

        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            marginTop: 15,
            color: loading ? '#ccc' : '#000'
          }}
        >
          Already have an account?
        </Text>
        <Link href={"/auth/SignIn"} disabled={loading}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 5,
              fontWeight: "bold",
              color: loading ? '#ccc' : '#000'
            }}
          >
            Sign In here
          </Text>
        </Link>
      </View>
    </View>
  );
}