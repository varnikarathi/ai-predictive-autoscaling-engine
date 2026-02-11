🤖 AI Predictive Autoscaling Engine

An AI-based predictive autoscaling system built using Node.js and a custom Machine Learning model.
The project predicts future CPU usage and automatically decides when to scale resources instead of reacting late to load spikes.
This simulates how real cloud platforms perform autoscaling.

✨ Features

Real-time CPU & memory monitoring
Sliding window CPU history
Custom Linear Regression ML model
Future CPU prediction
Confidence-based scaling decisions
Cooldown protection to avoid rapid scaling
Min/Max instance limits
Explainable autoscaling logs
REST APIs using Express

🧠 How It Works

Every 5 seconds:
Collects system metrics
Stores CPU history
Trains ML model
Predicts future CPU
Calculates confidence
Applies scaling rules:
Scale UP if predicted CPU > 70% and confidence > 60%
Scale DOWN if predicted CPU < 30% and confidence > 60%
Uses cooldown to prevent frequent scaling

Flow:

Metrics → ML Prediction → Confidence → Scaling Decision → Repeat

🏗 Architecture

metrics.service → Collects system data
predictor.js → Machine learning model
scaling.service → Scaling policy + cooldown
autoscaler.js → Main control loop
server.js → Starts Express + autoscaler

🛠 Tech Stack

Node.js
Express
systeminformation
Custom Linear Regression

Git & GitHub

▶️ How to Run
git clone https://github.com/varnikarathi/ai-predictive-autoscaling-engine.git
cd backend
npm install
node src/server.js

Autoscaler runs automatically every 5 seconds.

📡 API Endpoints
Get current metrics
GET /metrics/current

Evaluate scaling
POST /scaling/evaluate

🎯 Learning Outcomes

Backend system design
Machine learning integration
Predictive autoscaling
Cooldown stabilization
Modular Node.js architecture
Real-time monitoring

🌱 Future Enhancements

Frontend dashboard
Docker & Kubernetes support
Database for metrics
Advanced ML models
Cloud integration


