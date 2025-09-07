import { View, Text, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api'; 

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  const recipe = useQuery(api.Recipes.getById, { id: recipeId });
  const [data, setData] = useState(null);

  useEffect(() => {
    if (recipe) {
      setData(recipe);
    }
  }, [recipe]);

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const json = data.jsondata;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Recipe Image */}
      <Image
        source={{ uri: data.imageUrl }}
        className="w-full h-56 rounded-b-2xl"
      />

      {/* Recipe Header */}
      <View className="p-4">
        <Text className="text-2xl font-bold">{json.recipeName}</Text>
        <Text className="text-gray-600 mt-2">{json.description}</Text>

        {/* Stats Section */}
        <View className="flex-row justify-between mt-4">
          <View className="items-center">
            <Text className="text-purple-600 font-bold">{json.calories}</Text>
            <Text className="text-gray-500 text-sm">Calories</Text>
          </View>
          <View className="items-center">
            <Text className="text-purple-600 font-bold">{json.cookTime} min</Text>
            <Text className="text-gray-500 text-sm">Time</Text>
          </View>
          <View className="items-center">
            <Text className="text-purple-600 font-bold">{json.serveTo}</Text>
            <Text className="text-gray-500 text-sm">Serve</Text>
          </View>
        </View>
      </View>

      {/* Ingredients */}
      <View className="p-4">
        <Text className="text-xl font-bold mb-2">Ingredients</Text>
        {json.ingredients.map((item, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <Text className="text-lg mr-2">{item.icon}</Text>
            <Text className="font-semibold">{item.ingredient}</Text>
            <Text className="text-gray-600 ml-2">{item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Steps / Directions */}
      <View className="p-4">
        <Text className="text-xl font-bold mb-2">Directions</Text>
        {json.steps.map((step, index) => (
          <View
            key={index}
            className="flex-row items-start mb-3 bg-purple-50 p-3 rounded-lg"
          >
            <Text className="bg-purple-600 text-white px-2 py-1 rounded-full mr-2">
              {index + 1}
            </Text>
            <Text className="flex-1 text-gray-800">{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
