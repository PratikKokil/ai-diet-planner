import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { CalendarAdd01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import Button from './shared/Button';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';
import moment from 'moment';
import { UserContext } from '../context/UserContext';
import MealPlanCard from './MealPlanCard';

export default function TodaysMealPlan() {
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const convex = useConvex();
  const { user } = useContext(UserContext);

  useEffect(() => {
    user && GetTodaysMealPlan();
  }, [user]);

  const GetTodaysMealPlan = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.MealPlan.getTodaysMealPlan, {
        date: moment().format('YYYY-MM-DD'),
        uid: user?._id,
      });
      console.log('Meal plan result:', result);
      setMealPlan(result || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Today's Meal Plan</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8837ff" style={{ marginTop: 20 }} />
      ) : mealPlan.length === 0 ? (
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 15,
            marginTop: 15,
          }}
        >
          <HugeiconsIcon icon={CalendarAdd01Icon} size={40} color="#8837ff" />
          <Text
            style={{
              fontSize: 16,
              color: 'grey',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            You don't have any meal plan for today
          </Text>
          <Button title="Create Meal Plan" onPress={() => {}} />
        </View>
      ) : (
        <FlatList
          data={mealPlan}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <MealPlanCard mealPlanInfo={item} refreshData={(GetTodaysMealPlan)}/>}
          style={{ marginTop: 15 }}
        />
      )}
    </View>
  );
}
