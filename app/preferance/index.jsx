import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useContext, useState } from "react";
import Input from "../../components/shared/Input"; 
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Dumbbell01Icon, Female02FreeIcons, Male02FreeIcons, PlusSignSquareIcon, WeightScaleIcon } from "@hugeicons/core-free-icons";
import Button from "../../components/shared/Button";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UpdateUserPref } from "../../convex/Users";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";
import { CalculateCaloriesAI } from "../../services/AiModel";
import Prompt from "../../shared/Prompt";

export default function Preferance() {

  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [gender, setGender] = useState();
  const [goal, setGoal] = useState();
  const UpdateUserPref = useMutation(api.Users.UpdateUserPref);
  const {user,setUser}= useContext(UserContext);

  const OnNext =async () => {
    if(!weight || !height ||!gender || !goal){
      Alert.alert("Please fill all the fields")
      return;
    }
    const data={
      uid:user?._id,
      weight:parseFloat(weight),
      height:parseFloat(height),
      gneder:gender,
      goal:goal
    }
   
    const PROMT=JSON.stringify(data)+Prompt.CALORIES_PROMPT
    const AIResult = await CalculateCaloriesAI(PROMT)
    console.log(AIResult.choices[0].message.content)
    const AIResp= AIResult.choices[0].message.content;
    const JSONContent = JSON.parse(AIResp.replace('```json','').replace('```',''));
    console.log(JSONContent)
    const result = await UpdateUserPref({
      ...data,
      ...JSONContent
  })

  setUser((prev)=>({...prev,...data}))
  console.log(user)
  router.replace("/(tabs)/Home")
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Tell us about yourself</Text>
      <Text style={styles.subHeader}>This helps us create your personalized meal plan</Text>

      {/* Inputs */}
      <View style={styles.inputsRow}>
        <View style={styles.inputWrapper}>
          <Input
            label="Weight (kg)"
            placeholder="e.g. 70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Input placeholder="e.g 5.10" 
          label="Height (ft)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          />
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity style={[styles.genderBox,{
            borderColor:gender ==='Male'?'#4287f5':'gray'
          }]} onPress={() => setGender('Male')}>
            <HugeiconsIcon icon={Male02FreeIcons} size={40} color={"#4287f5"} />
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.genderBox,{
            borderColor:gender ==='Female'?'#F542b3':'gray'
          }]} onPress={()=> setGender('Female')}>
            <HugeiconsIcon icon={Female02FreeIcons} size={40} color={"#F542b3"} />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Goal Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's Your Goal?</Text>

        <TouchableOpacity style={[styles.goalBox,{
            borderColor:goal ==='Weight Loss'?'#f57c42':'gray'
        }]} onPress={() => setGoal('Weight Loss')}>
          <HugeiconsIcon icon={WeightScaleIcon} size={40} color="#f57c42" />
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalText}>Weight Loss</Text>
            <Text style={styles.goalSubText}>Reduce body fat & get leaner</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.goalBox,{
            borderColor:goal ==='Muscle Gain'?'#4287f5':'gray'
        }]} onPress={() => setGoal('Muscle Gain')}>
          <HugeiconsIcon icon={Dumbbell01Icon} size={40} color="#4287f5" />
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalText}>Muscle Gain</Text>
            <Text style={styles.goalSubText}>Build muscle & get stronger</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.goalBox,{
            borderColor:goal ==='Weight Gain'?'#42f554':'gray'
        }]} onPress={() => setGoal('Weight Gain')}>
          <HugeiconsIcon icon={PlusSignSquareIcon} size={40} color="#42f554" />
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalText}>Weight Gain</Text>
            <Text style={styles.goalSubText}>Increase healthy body mass</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Button title="Next" onPress={OnNext} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  inputsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
  },
  genderBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  genderText: {
    marginTop: 5,
    fontWeight: "500",
    fontSize: 14,
  },
  goalBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 15,
  },
  goalTextContainer: {
    marginLeft: 15,
  },
  goalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  goalSubText: {
    color: "gray",
    fontSize: 14,
  },
});
