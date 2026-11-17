function validateSecurityEnvironment() {
    if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'ai-predictive-autoscaling-demo-jwt-secret-key-32chars';
    }
}

function getAllowedOrigins() {
    const configured = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,https://ai-predictive-autoscaling-engine.onrender.com';
    return new Set(configured.split(',').map((origin) => origin.trim()).filter(Boolean));
}

module.exports = { validateSecurityEnvironment, getAllowedOrigins };
