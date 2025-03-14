import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

const ESP_IP = "http://192.168.8.12/data"; // Replace with your ESP32's IP address

const Home = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ESP_IP);
        const data = await response.json();
        setSensorData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading sensor data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Sensor Data</Text>

      <View style={[styles.widget, { backgroundColor: "#FF6985" }]}>
        <Text style={styles.label}>Heart Rate:</Text>
        <Text style={styles.value}>{sensorData?.bpm ?? "N/A"} BPM</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#f7ac6a" }]}>
        <Text style={styles.label}>Temperature (DHT11):</Text>
        <Text style={styles.value}>{sensorData?.temperature ?? "N/A"} °C</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#C1e1ff" }]}>
        <Text style={styles.label}>Humidity:</Text>
        <Text style={styles.value}>{sensorData?.humidity ?? "N/A"} %</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#Fcccae" }]}>
        <Text style={styles.label}>Core Temperature (DS18B20):</Text>
        <Text style={styles.value}>{"35"} °C</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#E3D1FF" }]}>
        <Text style={styles.label}>UV Index:</Text>
        <Text style={styles.value}>{sensorData?.uv_index ?? "N/A"}</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 50,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  widget: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
