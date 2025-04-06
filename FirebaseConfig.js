import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgf0jBkpJDaRJCZHn1CVXEh_OhQghJT8s",
  authDomain: "com.nere.heatstrokeapp",
  projectId: "rnapp-5d451",
  storageBucket: "rnapp-5d451.firebasestorage.app",
  messagingSenderId: "neelgats2004@gmail.com",
  appId: "1:598438709901:android:bc7b0e18e85bc7405070c4"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

