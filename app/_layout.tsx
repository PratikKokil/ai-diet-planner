import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
// eslint-disable-next-line import/no-unresolved
import { UserContext } from "../context/UserContext.jsx";
import { useState } from "react";
export default function RootLayout() {
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
 const [user,setUser]=useState();
  return (

    <ConvexProvider client={convex}>
      <UserContext.Provider value={{user,setUser}}>
        <Stack screenOptions={{
          headerShown:false
         }}>
        <Stack.Screen name="index"/>
        </Stack>
      </UserContext.Provider>

    </ConvexProvider>
  );
}
