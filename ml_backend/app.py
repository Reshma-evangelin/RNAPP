from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
model = joblib.load("predict.pkl")

# Define expected features and label mapping
expected_features = ['Age', 'BMI', 'Body_Temp', 'Heart_Rate', 'Env_Temp', 'Humidity', 'UV_Index']
label_mapping = {0: "Low", 1: "Medium", 2: "High"}

@app.route('/')
def home():
    return "Heatstroke Risk Predictor is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Check if all expected features are present
        if not all(feature in data for feature in expected_features):
            missing = [feature for feature in expected_features if feature not in data]
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        # Prepare data for prediction
        input_df = pd.DataFrame([{
            feature: float(data[feature]) for feature in expected_features
        }])

        # Predict
        prediction = model.predict(input_df)
        risk_level = label_mapping[prediction[0]]

        return jsonify({
            "prediction": risk_level,
            "code": int(prediction[0])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Replace with your local IP and desired port if testing on LAN
    app.run(host='0.0.0.0', port=5000, debug=True)
