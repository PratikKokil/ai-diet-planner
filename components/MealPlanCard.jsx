import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useContext } from 'react';
import { CheckmarkSquare02Icon, SquareIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { RefreshDataContext } from '../context/RefreshDataContext';

export default function MealPlanCard({ mealPlanInfo }) {
  const { mealType, recipe } = mealPlanInfo;
  const updateStatus = useMutation(api.MealPlan.updateStatus);
  const{refreshData,setRefreshData}=useContext(RefreshDataContext)
  const onCheck = async (status) => {
    try {
      await updateStatus({
        id: mealPlanInfo?._id,
        status,
        calories:recipe?.jsonData?.calories
        
      });
      Alert.alert('Great!', 'Status Updated!');
      setRefreshData(Date.now())
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Recipe Image */}
      <Image
        source={{ uri: recipe?.imageUrl }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 15,
          marginRight: 12,
        }}
      />

      {/* Info Section */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color:
              mealType === 'Breakfast'
                ? '#2e7d32'
                : mealType === 'Lunch'
                ? '#7b1fa2'
                : '#d32f2f',
            marginBottom: 2,
          }}
        >
          {mealType}
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#000',
          }}
          numberOfLines={1}
        >
          {recipe?.recipeName}
        </Text>

        <Text style={{ fontSize: 14, color: '#4caf50', marginTop: 4 }}>
          {recipe?.jsonData?.calories
            ? `${recipe.jsonData.calories} kcal`
            : 'N/A kcal'}
        </Text>
      </View>

      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onCheck(!mealPlanInfo?.status)}
        style={{
          width: 36,
          height: 36,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: mealPlanInfo?.status ? '#e8f5e9' : '#f5f5f5',
        }}
      >
        <HugeiconsIcon
          icon={mealPlanInfo?.status ? CheckmarkSquare02Icon : SquareIcon}
          size={28}
          color={mealPlanInfo?.status ? '#4caf50' : '#777'}
        />
      </TouchableOpacity>
    </View>
  );
}
