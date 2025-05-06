import React, { useEffect, useState} from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from "react-native";
import { getDatabase, ref, push, onValue } from "firebase/database"; // ✅ import push
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, query, limitToLast } from "firebase/database";
import axios from "axios"; // ✅ import axios for HTTP requests


const ESP_IP = "http://192.168.8.12/data"; // Replace with your ESP32's IP address


const Home = ({ navigation }) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState(null);

  
  const predictHeatstrokeRisk = async (sensorData) => {
    try {
      const payload = {
        Age: 25, // Replace with dynamic value if needed
        BMI: 22.5, // Replace with user's actual BMI
        Body_Temp: sensorData?.core_temp,
        Heart_Rate: sensorData?.heart_rate,
        Env_Temp: sensorData?.temperature_dht,
        Humidity: sensorData?.humidity,
        UV_Index: sensorData?.uv_index,
      };
  
      const response = await axios.post("http://192.168.133.109:5000/predict", payload);
      
      const result = response.data;
      console.log("Prediction:", result.prediction);
  
      setRiskLevel(result.prediction); // "High Risk" or "Low Risk"
    } catch (error) {
      console.error("Prediction error:", error.message);
      setRiskLevel("Error");
    }
  };
  
  


  const handleLogout = () => {
    signOut(auth)
      .then(async() => {
        await AsyncStorage.setItem("isLoggedIn", "false");
        navigation.replace("loginScreen"); // after logout, go to login
      })
      .catch((error) => {
        console.error("Sign Out Error", error);
      });
  };

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.uid;

    if (sensorData) {
      // Call the prediction function with the latest sensor data
      predictHeatstrokeRisk(sensorData);
    }
    //aeebeeceepredictHeatstrokeRisk(features);
  
    // ✅ Listen for latest sensor data in real-time
    const userRef = ref(db, "sensor_data/" + userId);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data);
        const latest = entries[entries.length - 1]; // Get the most recent entry
        setSensorData(latest);
        setLoading(false);
        //console.log("Latest Sensor Data:", latest);

      }
    },[sensorData]);
  
    // ✅ Periodically fetch from ESP32 and push to Firebase
    const fetchData = async () => {
      try {
        const response = await fetch(ESP_IP);
        const fetchedData = await response.json();
  
        if (userId && fetchedData) {
          await push(userRef, {
            ...fetchedData,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
  
    fetchData(); // First call immediately
    const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds
  
    return () => {
      clearInterval(interval); // Clear interval on unmount
      unsubscribe(); // Unsubscribe from Firebase listener
    };
  }, [sensorData]);
  

 /* useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ESP_IP);
        const fetchedData = await response.json();
        
        // ✅ Push to Firebase
        const db = getDatabase();
        const userId = auth.currentUser?.uid;
        
        // const latestDataRef = query(ref(db, "sensor_data/" + userId), limitToLast(1));
        // console.log("Latest Data Ref:", latestDataRef); // Debugging line
        // const snapshot = await get(latestDataRef);
        // const data = Object.values(snapshot.val())[0]; // Get the only (latest) entry
        // setSensorData(data);
        
        // if (snapshot.exists()) {
        //   const data = Object.values(snapshot.val())[0]; // Get the only (latest) entry
        //   setSensorData(data);
        // }
        if (userId && fetchedData) {
          const userRef = ref(db, "sensor_data/" + userId);
          push(userRef, {
            ...fetchedData,
            timestamp: Date.now(),
          });
        }

        setSensorData(fetchedData);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setLoading(false);
      }
    };
	
	 


    fetchData(); // ✅ call function
    const interval = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    return () => clearInterval(interval);
  }, []); */

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
        <Text style={styles.label}>Environment Temperature:</Text>
        <Text style={styles.value}>{sensorData?.temperature_dht ?? "N/A"} °C</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#C1e1ff" }]}>
        <Text style={styles.label}>Humidity:</Text>
        <Text style={styles.value}>{sensorData?.humidity ?? "N/A"} %</Text>
      </View>

      <View style={[styles.widget, { backgroundColor: "#Fcccae" }]}>
        <Text style={styles.label}>Core Temperature:</Text>
        <Text style={styles.value}>{sensorData?.core_temp ?? "N/A"} °C</Text> {/* You can change this later */}
      </View>

      <View style={[styles.widget, { backgroundColor: "#E3D1FF" }]}>
        <Text style={styles.label}>UV Index:</Text>
        <Text style={styles.value}>{sensorData?.uv_index ?? "N/A"}</Text>
      </View>

      <View style={{ width: "90%", marginBottom: 20 }}>
      <Button title="Logout" color="#FF3B30" onPress={handleLogout} />
    </View>

    {riskLevel && (
  <View style={[styles.widget, { backgroundColor: "#ffd966" }]}>
    <Text style={styles.label}>Heatstroke Risk:</Text>
    <Text style={styles.value}>{riskLevel}</Text>
  </View>
)}
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
