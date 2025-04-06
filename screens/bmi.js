import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

export default function BMIScreen({ navigation }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Controls splash screen

  const calculateBMI = () => {
    if (!height && !weight && !age && !name) {
      alert("Please enter the details");
      return;
    }
    if (!height) {
      alert("Please enter valid height");
      return;
    }
    if (!name) {
      alert("Please enter valid name");
      return;
    }
    if (!age) {
      alert("Please enter valid age");
      return;
    }
    if (!weight) {
      alert("Please enter valid weight");
      return;
    }
    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(2));

    if (bmiValue < 18.5) {
      setCategory("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setCategory("Normal Weight");
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setCategory("Overweight");
    } else {
      setCategory("Obese");
    }
  };

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("Home");
    }, 2000); // 2-second splash screen effect
  };

  return isLoading ? (
    <View style={styles.splashScreen}>
      <Image
        source={require("../assets/sun.png")} // Make sure you have a sun.png image in assets
        style={styles.splashImage}
      />
      <ActivityIndicator size="large" color="#FFA500" />
      <Text style={styles.splashText}>Loading...</Text>
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>BMI Calculator</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TouchableOpacity style={styles.button} onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calculate BMI</Text>
        </TouchableOpacity>

        {bmi && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>BMI: {bmi}</Text>
            <Text style={[styles.categoryText, getCategoryStyle(category)]}>{category}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getCategoryStyle = (category) => {
  switch (category) {
    case "Underweight":
      return { color: "#1E90FF" };
    case "Normal Weight":
      return { color: "#28A745" };
    case "Overweight":
      return { color: "#FFC107" };
    case "Obese":
      return { color: "#DC3545" };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  innerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#FFF",
    fontSize: 16,
    elevation: 2,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "90%",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#aa",
    fontSize: 22,
  },
  resultContainer: {
    marginTop: 20,
    padding: 19,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#0FF",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    alignItems: "center",
    width: "90%",
  },
  resultText: {
    fontSize: 22,
    fontWeight: "bold",
    color:"f0f"
  },
  categoryText: {
    fontSize: 18,
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: "#28A745",
    padding: 15,
    width: "90%",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 15,
    elevation: 3,
  },
  splashScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFECB3",
  },
  splashImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500",
  },
});

