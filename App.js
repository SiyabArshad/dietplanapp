import React from 'react';
import { useEffect,useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_600SemiBold, useFonts } from "@expo-google-fonts/montserrat";
import { RFPercentage } from 'react-native-responsive-fontsize';
//screens
import LoginScreen from './app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';
import MealPlanScreen from './app/screens/MealPlan9Screen';
import PersonalizedMealPlanScreen from './app/screens/PersonalizedMealPlanScreen';
import DetailsScreen from './app/screens/DetailsScreen';
import AddFoodToMealPlanScreen from './app/screens/AddFoodToMealPlanScreen';
import ProfileSettingsScreen from './app/screens/ProfileSettingsScreen';
import AddExcersiseScreen from './app/screens/AddExerciseScreen';
import PersonalizedWorkoutPlanScreen from './app/screens/PersonalizedWorkoutPlan';
import AddFoodScreen from './app/screens/AddFoodScreen';
import WorkoutPlanScreen from './app/screens/WorkoutPlanScreen';
import AddRecipesScreen from './app/screens/AddRecipesScreen';
import AddWeightScreen from './app/screens/AddWeightScreen';
import ProgressScreen from './app/screens/ProgressScreen';
import ScheduleScreen from './app/screens/ScheduleScreen';
import ForgetPasswordScreen from './app/screens/ForgetPasswordScreen';
import AddMoodScreen from "./app/screens/AddMoodScreen"
//config
import Colors from './app/config/Colors';
import {Authcontext} from "./app/config/auth"
const Stack = createStackNavigator();

export default function App() {
  const { user } = Authcontext();
  const[load,setload]=useState(false)
  useEffect(()=>{
    setload(true)
    setTimeout(() => {
      setload(false)
    }, 2000);
  },[])
  
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_600SemiBold
  })

  if (!fontsLoaded||load) 
  {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
    <ActivityIndicator size={RFPercentage(6)} color={Colors.primary} />
  </View>
  )
  
  }
else
{
  return (
    user?<Protected></Protected>:<Base></Base>
  )
}

}

const Base=()=>{
  return(
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{
  headerShown: false
}}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
const Protected=()=>{
  return(
    <NavigationContainer>
    <Stack.Navigator  screenOptions={{
  headerShown: false
}}>
    <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="MealPlanScreen" component={MealPlanScreen} />
        <Stack.Screen name="PersonalizedMealPlanScreen" component={PersonalizedMealPlanScreen} />
        <Stack.Screen name="AddFoodToMealPlanScreen" component={AddFoodToMealPlanScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="ProfileSettingsScreen" component={ProfileSettingsScreen} />
        <Stack.Screen name="AddExcersiseScreen" component={AddExcersiseScreen} />
        <Stack.Screen name="PersonalizedWorkoutPlanScreen" component={PersonalizedWorkoutPlanScreen} />
        <Stack.Screen name="WorkoutPlanScreen" component={WorkoutPlanScreen} />
        <Stack.Screen name="AddFoodScreen" component={AddFoodScreen} />
        <Stack.Screen name="AddRecipesScreen" component={AddRecipesScreen} />
        <Stack.Screen name="AddWeightScreen" component={AddWeightScreen} />
        <Stack.Screen name="AddMoodScreen" component={AddMoodScreen} />
        <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
        <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

// Happy Coding :)


