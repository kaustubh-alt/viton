import config from '../config';

/**
 * API Service for handling API requests
 */
class ApiService {
  constructor() {
    this.apiKey = config.api.key;
    this.apiUrl = config.api.url;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Generate a virtual try-on image
   * @param {File} modelImage - The model image file
   * @param {File} clothImage - The clothing item image file
   * @returns {Promise<Object>} - The API response
   */
  async generateTryOn(modelImage, clothImage) {
    try {
      const formData = new FormData();
      formData.append('model_image', modelImage);
      formData.append('cloth_image', clothImage);

      const response = await fetch(`${this.apiUrl}/try-on`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating try-on:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - The user profile data
   */
  async getUserProfile(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 