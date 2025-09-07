import { View, Text, Platform, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UserContext } from '../../context/UserContext';
import RecipeCard from '../../components/RecipeCard';
import { useRouter } from 'expo-router';

export default function Meals() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Get all recipes using your existing query
  const recipeList = useQuery(api.Recipes.GetAllrecipes);



  // Loading state
  if (recipeList === undefined) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 40 : 30,
      }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f8f9fa',
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 40 : 30,
    }}>
      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 16
      }}>
        Discover Recipes 🍝
      </Text>

      <FlatList
        data={recipeList || []} // 👈 always an array
        renderItem={({ item }) => (
          <RecipeCard recipe={item}  />
        )}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginHorizontal: 0,
        }}
        ListEmptyComponent={
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
              No recipes found 🍽️
            </Text>
            <Text style={{ fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }}>
              Start by creating your first recipe!
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
        }}
      />
    </View>
  );
}
