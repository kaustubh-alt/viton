import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageUploadBox = ({ title, description, onImageUpload, boxType }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const boxRef = useRef(null);
  const theme = useTheme();

  const onDrop = useCallback(async acceptedFiles => {
    setError('');
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }

      setIsLoading(true);
      try {
        const imageDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        setImage(imageDataUrl);
        onImageUpload(imageDataUrl, boxType);
      } catch (error) {
        console.error('Image processing error:', error);
        setError('Failed to process image.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [onImageUpload, boxType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
  });

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload(null, boxType);
  };

  const borderColor = boxType === 'model' ? theme.palette.primary.main : theme.palette.secondary.main;

  return (
    <Paper 
      ref={boxRef}
      elevation={4} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ 
        p: 3, 
        borderTop: `4px solid ${borderColor}`,
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[10],
          transform: 'translateY(-5px)',
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: borderColor, 
            position: 'relative',
            display: 'inline-block',
            mb: 1.5,
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -2,
              width: isHovered ? '100%' : '25%',
              height: '2px',
              backgroundColor: borderColor,
              transition: 'width 0.3s ease-in-out',
            },
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!image ? (
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? borderColor : 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            backgroundColor: isHovered ? `${borderColor}10` : 'transparent',
            '&:hover': {
              borderColor: borderColor, // Make border same color as the box
              backgroundColor: `${borderColor}10`, // Light background
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 50, color: borderColor, mb: 2 }} />
          <Typography variant="body1" fontWeight={500}>
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports: JPG, PNG, WEBP (Max 10MB)
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', minHeight: 300, display: 'flex', justifyContent: 'center' }}>
          <img 
            src={image} 
            alt={`Uploaded ${boxType}`} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
            }} 
          />
        </Box>
      )}

      {image && (
        <Fade in={true}>
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 11 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemoveImage}
              sx={{ borderRadius: '20px' }}
            >
              Remove
            </Button>
          </Stack>
        </Fade>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Processing image...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ImageUploadBox;