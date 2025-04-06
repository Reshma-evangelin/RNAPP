import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../FirebaseConfig";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "495777317410-smotldfrto6vmct4ouqhkuin0bull2s8.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.navigate("bmi");
        })
        .catch((error) => Alert.alert("Login Error", error.message));
    }
  }, [response]);

  const handleLogin = () => {
    if (!userId || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    signInWithEmailAndPassword(auth, userId, password)
    .then(() => {
      navigation.navigate("bmi");
    })
    .catch((error) => Alert.alert("Login Failed", error.message));
};
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/logo.png")} // Replace with your logo
        style={styles.logo}
      />

      <Text style={styles.title}>Your all time monitor</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image
          source={require("../assets/google-icon.png")} // Use a small Google icon here
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.signupButton}
  onPress={() => navigation.navigate("signUpScreen")}
>
  <Text style={styles.signupText}>
    New here? <Text style={{ color: "#007bff" }}>Sign Up</Text>
  </Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
  },
  loginButton: {
    backgroundColor: "#007bff",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    paddingVertical: 14,
    marginTop: 15,
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#555",
  },
  signupButton: {
    marginTop: 25,
  },
  signupText: {
    fontSize: 14,
    color: "#333",
  },
});
