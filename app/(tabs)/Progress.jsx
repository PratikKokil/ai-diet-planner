import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { UserContext } from '../../context/UserContext';
import { RefreshDataContext } from '../../context/RefreshDataContext';
import { 
  Fire02Icon, 
  Clock01FreeIcons, 
  Delete02Icon,
  CalendarCheckIn01Icon,
  Restaurant01Icon 
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';

export default function ProgressScreen() {
  const { user } = useContext(UserContext);
  const { refreshData, setRefreshData } = useContext(RefreshDataContext);
  const [selectedDateIndex, setSelectedDateIndex] = useState(1); // 1 = today (yesterday is 0)
  
  // Generate date options (yesterday, today, tomorrow, +4 more days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -1; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      let label;
      if (i === -1) label = 'Yesterday';
      else if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';
      else {
        label = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      dates.push({
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        label,
        fullDate: date,
        isToday: i === 0,
        isPast: i < 0,
        isFuture: i > 0,
      });
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();
  const selectedDate = dateOptions[selectedDateIndex]?.date;

  // Get meal plan for selected date using your existing query
  const mealPlan = useQuery(
    api.MealPlan.getTodaysMealPlan,
    user?._id && selectedDate 
      ? { uid: user._id, date: selectedDate }
      : "skip"
  );

  // Group meals by meal type
  const groupMealsByType = (meals) => {
    if (!meals) return {};
    
    return {
      Breakfast: meals.filter(meal => meal.mealType === 'Breakfast'),
      Lunch: meals.filter(meal => meal.mealType === 'Lunch'),
      Dinner: meals.filter(meal => meal.mealType === 'Dinner'),
      Snack: meals.filter(meal => meal.mealType === 'Snack'),
    };
  };

  // Calculate total calories
  const calculateTotalCalories = (meals) => {
    if (!meals) return 0;
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const groupedMeals = groupMealsByType(mealPlan);
  const totalCalories = calculateTotalCalories(mealPlan);

  // Render date option
  const renderDateOption = ({ item, index }) => {
    const isSelected = selectedDateIndex === index;
    
    return (
      <TouchableOpacity
        style={[
          styles.dateOption,
          isSelected && styles.selectedDateOption,
          item.isPast && styles.pastDateOption,
        ]}
        onPress={() => setSelectedDateIndex(index)}
      >
        <Text style={[
          styles.dateLabel,
          isSelected && styles.selectedDateLabel,
          item.isPast && styles.pastDateLabel,
        ]}>
          {item.label}
        </Text>
        <Text style={[
          styles.dateNumber,
          isSelected && styles.selectedDateNumber,
          item.isPast && styles.pastDateNumber,
        ]}>
          {item.fullDate.getDate()}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render meal item
  const renderMealItem = (meal) => {
    return (
      <View key={meal._id} style={styles.mealItem}>
        <Image
          source={{ uri: meal.recipe?.imageUrl }}
          style={styles.mealImage}
        />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal.recipe?.recipeName}</Text>
          <View style={styles.mealDetails}>
            <View style={styles.detailItem}>
              <HugeiconsIcon icon={Fire02Icon} color="#FF6B6B" size={16} />
              <Text style={styles.detailText}>{meal.calories || 0} kcal</Text>
            </View>
            {meal.recipe?.jsonData?.cookTime && (
              <View style={styles.detailItem}>
                <HugeiconsIcon icon={Clock01FreeIcons} color="#4ECDC4" size={16} />
                <Text style={styles.detailText}>{meal.recipe.jsonData.cookTime} min</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Render meal type section
  const renderMealTypeSection = (mealType, meals) => {
    if (!meals || meals.length === 0) {
      return (
        <View key={mealType} style={styles.mealTypeSection}>
          <View style={styles.mealTypeHeader}>
            <HugeiconsIcon icon={Restaurant01Icon} color="#666" size={20} />
            <Text style={styles.mealTypeTitle}>{mealType}</Text>
            <Text style={styles.mealCount}>0 items</Text>
          </View>
          <View style={styles.emptyMealSection}>
            <Text style={styles.emptyMealText}>No {mealType.toLowerCase()} planned</Text>
          </View>
        </View>
      );
    }

    const sectionCalories = meals.reduce((total, meal) => total + (meal.calories || 0), 0);

    return (
      <View key={mealType} style={styles.mealTypeSection}>
        <View style={styles.mealTypeHeader}>
          <HugeiconsIcon icon={Restaurant01Icon} color="#4CAF50" size={20} />
          <Text style={styles.mealTypeTitle}>{mealType}</Text>
          <Text style={styles.mealCount}>{meals.length} items</Text>
          <Text style={styles.sectionCalories}>{sectionCalories} kcal</Text>
        </View>
        <View style={styles.mealsContainer}>
          {meals.map(meal => renderMealItem(meal))}
        </View>
      </View>
    );
  };

  if (mealPlan === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading meal plan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracker</Text>
        <View style={styles.caloriesSummary}>
          <HugeiconsIcon icon={Fire02Icon} color="#FF6B6B" size={24} />
          <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
        </View>
      </View>

      {/* Date Selection */}
      <View style={styles.dateSelectionContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dateOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDateOption}
          contentContainerStyle={styles.dateScrollContainer}
        />
      </View>

      {/* Selected Date Info */}
      <View style={styles.selectedDateInfo}>
        <HugeiconsIcon icon={CalendarCheckIn01Icon} color="#4CAF50" size={20} />
        <Text style={styles.selectedDateText}>
          {dateOptions[selectedDateIndex]?.fullDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Meal Plan */}
      <ScrollView 
        style={styles.mealPlanContainer}
        showsVerticalScrollIndicator={false}
      >
        {mealPlan && mealPlan.length > 0 ? (
          <>
            {renderMealTypeSection('Breakfast', groupedMeals.Breakfast)}
            {renderMealTypeSection('Lunch', groupedMeals.Lunch)}
            {renderMealTypeSection('Dinner', groupedMeals.Dinner)}
            {renderMealTypeSection('Snack', groupedMeals.Snack)}
          </>
        ) : (
          <View style={styles.emptyState}>
            <HugeiconsIcon icon={Restaurant01Icon} color="#ccc" size={64} />
            <Text style={styles.emptyStateTitle}>No meals planned</Text>
            <Text style={styles.emptyStateText}>
              {dateOptions[selectedDateIndex]?.isPast 
                ? "No meals were recorded for this day"
                : "Start planning your meals for this day"
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#333',
  },
  dateSelectionContainer: {
    paddingVertical: 16,
  },
  dateScrollContainer: {
    paddingHorizontal: 20,
  },
  dateOption: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateOption: {
    backgroundColor: '#4CAF50',
  },
  pastDateOption: {
    backgroundColor: '#f5f5f5',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedDateLabel: {
    color: 'white',
  },
  pastDateLabel: {
    color: '#999',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  selectedDateNumber: {
    color: 'white',
  },
  pastDateNumber: {
    color: '#666',
  },
  selectedDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  mealPlanContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mealTypeSection: {
    marginBottom: 24,
  },
  mealTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  mealCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  sectionCalories: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  mealsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyMealSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyMealText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  mealItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});