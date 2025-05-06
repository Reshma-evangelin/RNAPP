import firebase_admin
from firebase_admin import credentials, db
import joblib
import pandas as pd

# Path to your service account key
cred = credentials.Certificate('C:\Users\User\OneDrive\Documents\GitHub\RNAPP\serviceAccountKey.json')

# Initialize Firebase Admin SDK
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://rnapp-5d451-default-rtdb.firebaseio.com/'  # your database URL
})

def fetch_latest_sensor_data():
    ref = db.reference('esp32/sensor_data')
    data = ref.get()
    return data

# Load the ML model
model = joblib.load('predict.pkl')

# Load your trained ML model
with open('C:\Users\User\OneDrive\Documents\GitHub\RNAPP\predict.pkl', 'rb') as model_file:  # Replace with your .pkl file path
    model = joblib.load(model_file)

print("Model loaded successfully.")

# Fetch latest sensor data from Firebase
doc_ref = db.collection('esp32').document('sensor_data')
doc = doc_ref.get()

if doc.exists:
    data = doc.to_dict()
    print("Fetched sensor data:", data)
else:
    print("No sensor data found.")
