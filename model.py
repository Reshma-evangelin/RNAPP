import firebase_admin
from firebase_admin import credentials, db
import pickle

# 1. Initialize Firebase
cred = credentials.Certificate("C:\Users\User\OneDrive\Documents\GitHub\RNAPP\serviceAccountKey.json")  # <-- You need a service account JSON key
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://rnapp-5d451-default-rtdb.firebaseio.com/'  # your DB URL
})

# 2. Load your ML model
with open('C:\Users\User\OneDrive\Documents\GitHub\RNAPP\assets\predict.pkl', 'rb') as file:
    model = pickle.load(file)

print("Firebase and Model loaded successfully 🚀")
