import { View, Text, Platform, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import { 
  AnalyticsUpIcon, 
  CookBookIcon, 
  Login03Icon, 
  ServingFoodIcon, 
  WalletAdd02Icon,
  ArrowRight01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { UserContext } from '../../context/UserContext';
import {auth} from './../../services/FirebaseConfig'
import { signOut } from 'firebase/auth';
const menuOptions = [
  {
    title: 'My Progress',
    icon: AnalyticsUpIcon,
    path: '/(tabs)/Progress'
  },
  {
    title: 'Explore Recipes',
    icon: CookBookIcon,
    path: '/(tabs)/Meals'
  },
  {
    title: 'Ai Recipes',
    icon: ServingFoodIcon,
    path: '/generate-ai-recipe'
  },
  {
    title: 'Billing',
    icon: WalletAdd02Icon,
    path: '/billing'
  },
  {
    title: 'Logout',
    icon: Login03Icon,
    path: '/logout'
  },
];

export default function Profile() {
  const { user,setUser } = useContext(UserContext);
  const router = useRouter();

  const handleMenuPress = (item) => {
    if (item.path === '/logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: () => 
            signOut(auth).then(()=>{
              console.log('SIGNOUT');
              setUser(null);
              router.replace('/')
            })
          }
        ]
      );
    } 
    else if(item.path ==='/billing'){
      Alert.alert('Feature coming soon...')
    }
    else {
      router.push(item.path);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Profile</Text>
      
      {/* User Info */}
      <View style={styles.userContainer}>
        <Image 
          source={require('./../../assets/images/userIcon.png')}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {menuOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuLeft}>
              <HugeiconsIcon icon={item.icon} size={24} color="#8837ff" />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
});