import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FirebaseConfig"; // import your Firebase config here
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import Screens
import Home from "./screens/Home";
import LoginScreen from "./screens/loginScreen"; // capitalize for components
import Bmi from "./screens/bmi"; // capitalize for components
import SignupScreen from "./screens/signUpScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading indicator

  useEffect(() => {

    const checkLoginStatus = async () => {
      try {
        const loggedInStatus = await AsyncStorage.getItem("isLoggedIn");
        const storedBmi = await AsyncStorage.getItem("userBmi");
  
        // If user is logged in, navigate to Home, else Login screen
        if (loggedInStatus === "true") {
          if (storedBmi) {
            setInitialRoute("Home");  // BMI already entered → go to Home
          } else {
            setInitialRoute("bmi");   // No BMI → go to BMI page
          }
          //setIsLoggedIn(true);
        } else {
          setInitialRoute("loginScreen"); // Not logged in
          //setIsLoggedIn(false);
        }
      } catch (error) {
        console.log(error);
        setInitialRoute("loginScreen");
      }
    };
  
    checkLoginStatus();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // done checking
    });

    return unsubscribe; // clean up the listener
  }, []);

  if (loading) {
    // optional loading screen
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "loginScreen"}>
        <Stack.Screen
          name="loginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bmi"
          component={Bmi}
          options={{ title: "BMI Calculator" }}
        />
        <Stack.Screen
          name="signUpScreen"
          component={SignupScreen}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
