import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function BMIScreen({ navigation }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) {
      alert("Please enter valid height and weight");
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />
      <TextInput style={styles.input} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>BMI: {bmi}</Text>
          <Text style={[styles.categoryText, getCategoryStyle(category)]}>{category}</Text>
        </View>
      )}

        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

    </View>
  );
}

const getCategoryStyle = (category) => {
  switch (category) {
    case "Underweight":
      return { color: "blue" };
    case "Normal Weight":
      return { color: "green" };
    case "Overweight":
      return { color: "orange" };
    case "Obese":
      return { color: "red" };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 18,
    marginTop: 5,
  },
});
