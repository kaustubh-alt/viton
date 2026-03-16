import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Snackbar,
  Container,
  CircularProgress,
} from '@mui/material';
import ImageUploadBox from './ImageUploadBox';
import ResultBox from './ResultBox';
import HowItWorks from './HowItWorks';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import config from '../config';
import { m } from 'framer-motion';

// Create a fallback image function outside of component
const createFallbackImage = () => {
  return `https://placehold.co/600x800/e2e8f0/1e293b?text=Example+try+on`;
};

// Check if API key is available
const isApiConfigured = () => {
  // More detailed logging to debug API configuration
  console.log('API Key:', config.api.key ? `${config.api.key.substring(0, 4)}...` : 'Not set');
  console.log('API URL:', config.api.url);
  return config.api.key && config.api.key.length > 0;
};

const VirtualTryOn = () => {
  const [modelImage, setModelImage] = useState(null);
  const [clothImage, setClothImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Reference to the how-it-works section
  const howItWorksRef = useRef(null);

  // Debug effect to check if the how-it-works section is properly mounted
  useEffect(() => {
    if (howItWorksRef.current) {
      console.log('How It Works section mounted with ID:', howItWorksRef.current.id);
    }
  }, []);

  const handleImageUpload = (image, type) => {
    if (type === 'model') {
      setModelImage(image);
    } else if (type === 'cloth') {
      setClothImage(image);
    }

    // Reset result when a new image is uploaded
    setResultImage(null);
    setError(null);
    setApiStatus('idle');
  };
  const sendImagesToAPI = async () => {
    setIsLoading(true);
    setResultImage(null);
    setApiStatus('loading');

    if (!modelImage || !clothImage) {
      alert("Please upload both images.");
      setIsLoading(false);
      setApiStatus('error');
      return;
    }

    try {
      const modelBlob = await fetch(modelImage).then(r => r.blob());
      const clothBlob = await fetch(clothImage).then(r => r.blob());

      const formData = new FormData();
      formData.append("image1", modelBlob, "model.jpg");
      formData.append("image2", clothBlob, "cloth.jpg");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 100000);

      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // First try to get the response as text
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error("Server error response:", responseText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("Invalid JSON response from server");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.generated_image) {
        throw new Error("No image data in response");
      }

      // Handle the image data
      const base64Image = data.generated_image.startsWith("data:")
        ? data.generated_image
        : `data:image/jpeg;base64,${data.generated_image}`;

      setResultImage(base64Image);
      setApiStatus('success');
      setSnackbarMessage('Image generated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {
      console.error("Error details:", error);
      setApiStatus('error');
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResult = async () => {
    if (!modelImage || !clothImage) {
      setError('Please upload both model and cloth images.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiStatus('loading');

    try {
      setSnackbarMessage('Generating virtual try-on...');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);

      // Check if API key is configured
      if (!isApiConfigured()) {
        console.warn('API key not configured. Using fallback image.');
        throw new Error('API key not configured');
      }

      // Extract base64 data from the data URLs
      const modelBase64 = modelImage.split(',')[1];
      const clothBase64 = clothImage.split(',')[1];

      // Prepare the request payload
      const requestData = {
        model_image: modelBase64,
        cloth_image: clothBase64,
        category: "Upper body", // Required parameter for Segmind API
        num_inference_steps: 35,
        guidance_scale: 2,
        seed: Math.floor(Math.random() * 1000000),
        base64: true
      };

      console.log('Sending request to API...', config.api.url);
      console.log('API Key available:', !!config.api.key);
      console.log('Request payload structure:', Object.keys(requestData));

      // Make the API request
      const response = await fetch(config.api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.api.key
        },
        body: JSON.stringify(requestData)
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        // Check for specific error messages
        if (errorText.includes("No human detected")) {
          throw new Error('No human detected in the model image. Please upload a clear image of a person.');
        }

        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // Handle JSON response
      const data = await response.json();
      console.log('API response data structure:', Object.keys(data));

      let resultImageData;
      if (data && data.output) {
        resultImageData = `data:image/jpeg;base64,${data.output}`;
      } else if (data && data.image) {
        resultImageData = `data:image/jpeg;base64,${data.image}`;
      } else if (data && data.images && data.images.length > 0) {
        resultImageData = `data:image/jpeg;base64,${data.images[0]}`;
      } else {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid response format from API');
      }

      setResultImage(resultImageData);
      setSnackbarMessage('Virtual try-on generated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setApiStatus('success');
      setIsLoading(false);

    } catch (err) {
      console.error('API Error:', err);

      // More descriptive error message
      let errorMessage = 'API error. Using example image.';
      if (err.message.includes('API key not configured')) {
        errorMessage = 'API key not configured. Using example image.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Check your connection.';
      } else if (err.message.includes('No human detected')) {
        errorMessage = 'No human detected in the model image. Please upload a clear image of a person.';
      } else {
        errorMessage = `API error: ${err.message}. Using example image.`;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);

      // Use fallback image
      loadFallbackImage();
    }
  };

  // Separate function to handle fallback image logic
  const loadFallbackImage = () => {
    const mockImageUrl = createFallbackImage();

    try {
      if (mockImageUrl.startsWith('data:')) {
        setResultImage(mockImageUrl);
        setIsLoading(false);
        setApiStatus('success');
      } else {
        fetch(mockImageUrl)
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              setResultImage(reader.result);
              setIsLoading(false);
              setApiStatus('success');
            };
            reader.readAsDataURL(blob);
          })
          .catch(error => {
            console.error('Fallback image loading failed:', error);
            setError('Unable to generate any result. Please try again later.');
            setApiStatus('error');
            setIsLoading(false);
          });
      }
    } catch (mockError) {
      console.error('Mock image generation failed:', mockError);
      setError('Unable to generate any result. Please try again later.');
      setApiStatus('error');
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDownloadResult = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'virtual-tryon-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: 'visible', // Allow content to overflow for scrolling
        height: 'auto', // Let content determine height
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: isMobile ? '2rem' : '2.5rem'
          }}
        >
          Virtual Cloth Try-On
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
          Upload a model image and a cloth image to see how the clothing would look on the model.
        </Typography>

        <Divider sx={{ mb: 4 }} />
      </Box>

      <Grid container spacing={3} alignItems="stretch" justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <ImageUploadBox
            title="Upload Model Image"
            description="Upload a full-body image of a person standing in a neutral pose."
            onImageUpload={(image) => handleImageUpload(image, 'model')}
            boxType="model"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4}>
          <ImageUploadBox
            title="Upload Cloth Image"
            description="Upload an image of the clothing item you want to try on."
            onImageUpload={(image) => handleImageUpload(image, 'cloth')}
            boxType="cloth"
          />
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <ResultBox
            resultImage={resultImage}
            isLoading={isLoading}
            error={error}
            apiStatus={apiStatus}
            onDownload={handleDownloadResult}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!modelImage || !clothImage || isLoading}
          onClick={sendImagesToAPI}
          //onClick={handleGenerateResult}
          startIcon={isLoading ? null : <AutoAwesomeIcon />}
          sx={{
            py: 2,
            px: 6,
            fontSize: '1.2rem',
            borderRadius: 2,
            minWidth: 250,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: (modelImage && clothImage && !isLoading)
              ? `0 0 10px 2px ${theme.palette.primary.main}40, 0 4px 15px ${theme.palette.primary.main}30`
              : 'none',
            animation: (modelImage && clothImage && !isLoading) ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                boxShadow: `0 0 10px 2px ${theme.palette.primary.main}40, 0 4px 15px ${theme.palette.primary.main}30`
              },
              '50%': {
                boxShadow: `0 0 15px 5px ${theme.palette.primary.main}60, 0 4px 20px ${theme.palette.primary.main}50`
              },
              '100%': {
                boxShadow: `0 0 10px 2px ${theme.palette.primary.main}40, 0 4px 15px ${theme.palette.primary.main}30`
              }
            },
            '&:disabled': {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
            '&:hover': {
              transform: (modelImage && clothImage && !isLoading) ? 'translateY(-3px)' : 'none',
              boxShadow: (modelImage && clothImage && !isLoading)
                ? `0 0 15px 5px ${theme.palette.primary.main}60, 0 8px 25px ${theme.palette.primary.main}40`
                : 'none',
            }
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress
                size={24}
                color="inherit"
                sx={{ mr: 1 }}
              />
              Processing...
            </>
          ) : (
            'Generate Try-On'
          )}
        </Button>
      </Box>

      <Box
        ref={howItWorksRef}
        sx={{
          mt: -1, // Reduced from mt: 6 to decrease the distance
          pt: 2,
          pb: 4,
          scrollMarginTop: '80px', // Add scroll margin to account for header
          borderRadius: 2,
          transition: 'all 0.3s ease',
          transform: 'scale(1.05)', // Increase size by 5%
          transformOrigin: 'center top', // Keep the scaling centered
          width: '100%', // Ensure the container takes full width
          mx: 'auto', // Center the container
          maxWidth: '90%', // Prevent overflow issues
          overflow: 'visible', // Allow content to be visible for scrolling
          height: 'auto', // Let content determine height
        }}
        id="how-it-works"
      >
        <HowItWorks onClose={() => { }} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VirtualTryOn;