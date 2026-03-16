// Simple script to test the Segmind API
const fetch = require('node-fetch');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

console.log('Testing API connection with:');
console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 4)}...` : 'Not set');
console.log('API URL:', API_URL);

// Function to convert image to base64
function imageToBase64(filePath) {
  const imageData = fs.readFileSync(filePath);
  return imageData.toString('base64');
}

// Test the API with sample images
async function testApi() {
  try {
    // Use placeholder images for testing
    const modelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const clothBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    const requestData = {
      model_image: modelBase64,
      cloth_image: clothBase64,
      category: "Upper body",
      num_inference_steps: 25,
      guidance_scale: 2,
      seed: 12345,
      base64: true
    };

    console.log('Sending test request to API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(requestData)
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('API response received successfully!');
    console.log('Response data structure:', Object.keys(data));
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testApi(); 