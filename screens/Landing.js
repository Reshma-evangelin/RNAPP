import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Landing({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Landing Page!</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
