import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Alert, Platform } from "react-native";
import React, { useState, useContext } from "react";
import { Fire02Icon, Clock01FreeIcons, PlusSignIcon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { UserContext } from '../context/UserContext';
import { RefreshDataContext } from "../context/RefreshDataContext";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RecipeCard({ recipe }) {
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  
  const addMeal = useMutation(api.MealPlan.addMeal);
  
  const recipeJson = recipe?.jsonData;
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  // Format date to YYYY-MM-DD for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle date picker change
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddToMeal = async () => {
    try {
      if (!user?._id) {
        Alert.alert('Error', 'Please login to add meals');
        return;
      }

      await addMeal({
        recipeId: recipe._id,
        uid: user._id,
        date: formatDate(selectedDate),
        mealType: selectedMealType,
        calories: recipeJson?.calories || 0,
        status: true
      });

      setModalVisible(false);
      setRefreshData();
      Alert.alert(
        'Success! 🎉', 
        `${recipe.recipeName} has been added to your ${selectedMealType.toLowerCase()} for ${formatDisplayDate(selectedDate)}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal to plan. Please try again.');
      console.error('Error adding meal:', error);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={{ flex: 1, margin: 5 }}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={{ uri: recipe?.imageUrl }}
          style={{ 
            width: "100%",
            height: 100,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}
        />

        <View style={{
          padding: 10,
          backgroundColor: 'white',
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15
        }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 6 }}>
            {recipe?.recipeName}
          </Text>

          <View style={[styles.infoContainer, { gap: 15, marginTop: 6 }]}>
            {/* Calories */}
            <View style={styles.infoContainer}>
              <HugeiconsIcon icon={Fire02Icon} color="red" size={18} />
              <Text style={styles.infoText}>
                {recipeJson?.calories ?? "N/A"} Kcal
              </Text>
            </View>

            {/* Cook time */}
            <View style={styles.infoContainer}>
              <HugeiconsIcon icon={Clock01FreeIcons} color="red" size={18} />
              <Text style={styles.infoText}>
                {recipeJson?.cookTime ?? "N/A"} min
              </Text>
            </View>
          </View>

          {/* Add to Meal Button */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <HugeiconsIcon icon={PlusSignIcon} color="white" size={16} />
            <Text style={styles.addButtonText}>Add to Meal</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Modal for meal selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Meal Plan</Text>
            <Text style={styles.recipeTitle}>{recipe?.recipeName}</Text>

            {/* Date Selection with Picker */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Select Date:</Text>
              <TouchableOpacity 
                style={styles.dateContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <View style={styles.dateDisplay}>
                  <HugeiconsIcon icon={Calendar03Icon} color="#4CAF50" size={20} />
                  <Text style={styles.dateText}>{formatDisplayDate(selectedDate)}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Meal Type Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionLabel}>Select Meal Type:</Text>
              <View style={styles.mealTypeContainer}>
                {mealTypes.map((mealType) => (
                  <TouchableOpacity
                    key={mealType}
                    style={[
                      styles.mealTypeButton,
                      selectedMealType === mealType && styles.selectedMealType
                    ]}
                    onPress={() => setSelectedMealType(mealType)}
                  >
                    <Text style={[
                      styles.mealTypeText,
                      selectedMealType === mealType && styles.selectedMealTypeText
                    ]}>
                      {mealType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleAddToMeal}
              >
                <Text style={styles.confirmButtonText}>Add to Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Time Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)} // 1 year ahead
          />
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 350,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  recipeTitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealTypeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectedMealType: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  mealTypeText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedMealTypeText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});