// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "netflixgpt-10240.firebaseapp.com",
  projectId: "netflixgpt-10240",
  storageBucket: "netflixgpt-10240.firebasestorage.app",
  messagingSenderId: "909306240799",
  appId: "1:909306240799:web:2be554781ed10ea537da2a",
  measurementId: "G-Q1H5P5QRTY",
};


const app = initializeApp(firebaseConfig);


export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export default app;
