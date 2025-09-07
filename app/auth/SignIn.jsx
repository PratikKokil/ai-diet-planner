import { View, Text, Image, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Button from "../../components/shared/Button";
import Input from "../../components/shared/Input";   
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/FirebaseConfig";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UserContext } from "../../context/UserContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const convex = useConvex();
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  // Function to auto-fill demo credentials
  const fillDemoCredentials = () => {
    setEmail("pratik@gmail.com");
    setPassword("Pratik@123");
  };
    
  const onSignIn = () => {
    if (!email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }

    setLoading(true);

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
            marginVertical: 20,
          }}
        >
          Welcome Back
        </Text>

        {/* Demo Credentials Banner */}
        <View style={{
          backgroundColor: '#e3f2fd',
          borderColor: '#2196f3',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          width: '100%'
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            marginBottom: 8
          }}>
            🎯 Demo Credentials for Visitors
          </Text>
          <Text style={{
            fontSize: 13,
            color: '#1565c0',
            textAlign: 'center',
            marginBottom: 2
          }}>
            Email: pratik@gmail.com
          </Text>
          <Text style={{
            fontSize: 13,
            color: '#1565c0',
            textAlign: 'center',
            marginBottom: 10
          }}>
            Password: Pratik@123
          </Text>
          <TouchableOpacity 
            onPress={fillDemoCredentials}
            style={{
              backgroundColor: '#2196f3',
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 6,
              alignSelf: 'center'
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold'
            }}>
              Use Demo Login
            </Text>
          </TouchableOpacity>
        </View>

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
          title={loading ? "Signing In..." : "Sign In"} 
          onPress={onSignIn}
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
              Please wait...
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
          Do not have an account?
        </Text>
        <Link href={"/auth/SignUp"} disabled={loading}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginTop: 5,
              fontWeight: "bold",
              color: loading ? '#ccc' : '#000'
            }}
          >
            Create New Account
          </Text>
        </Link>
      </View>
    </View>
  );
}