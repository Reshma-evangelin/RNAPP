import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getDatabase, ref, onValue, query, limitToLast } from "firebase/database";
import { auth, database } from "../FirebaseConfig";


const Home = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    console.log("User ID:", userId);okay
    if (!userId) return;

    const userRef = ref(database, "esp32/sensor_data");

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data:", data);
      if (data) {
      setSensorData(data);
      setLoading(false);
      }
    });

    return () => unsubscribe();
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
        <Text style={styles.value}>{sensorData?.heart_rate ?? "N/A"} BPM</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#f7ac6a" }]}>
        <Text style={styles.label}>Temperature (DHT11):</Text>
        <Text style={styles.value}>{sensorData?.temperature_dht ?? "N/A"} °C</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#C1e1ff" }]}>
        <Text style={styles.label}>Humidity:</Text>
        <Text style={styles.value}>{sensorData?.humidity ?? "N/A"} %</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#Fcccae" }]}>
        <Text style={styles.label}>Core Temperature (DS18B20):</Text>
        <Text style={styles.value}>{sensorData?.core_temp ?? "N/A"} °C</Text>
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
    elevation: 3,
    shadowColor: "#000",
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
