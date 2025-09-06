import React from "react";
import { Text, TextInput, View } from "react-native";

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry }) {
  return (
    <View style={{ width: "100%", alignItems: "center", marginBottom: 15 }}>
      {label && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 5,
            alignSelf: "flex-start",
            marginLeft: "10%",
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={{
          width: "80%",
          padding: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
        }}
      />
    </View>
  );
}
