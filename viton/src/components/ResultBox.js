import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  useTheme,
  Chip,
  Fade,
  Zoom,
  Stack
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ResultBox = ({ resultImage, isLoading, error, apiStatus = 'idle', onDownload }) => {
  const theme = useTheme();
  const borderColor = theme.palette.success.main;
  const [isHovered, setIsHovered] = useState(false);
  const boxRef = useRef(null);

  const getStatusChip = () => {
    switch (apiStatus) {
      case 'loading':
        return <Chip label="Processing..." color="primary" size="small" sx={{ position: 'absolute', top: 16, right: 16 }} />;
      case 'success':
        return <Zoom in><Chip icon={<CheckCircleIcon />} label="Success" color="success" size="small" sx={{ position: 'absolute', top: 16, right: 16 }} /></Zoom>;
      case 'error':
        return <Zoom in><Chip icon={<ErrorIcon />} label="Error" color="error" size="small" sx={{ position: 'absolute', top: 16, right: 16 }} /></Zoom>;
      default:
        return null;
    }
  };

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
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: theme.shadows[10],
          transform: 'translateY(-5px)',
        },
      }}
    >
      {getStatusChip()}
      
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
          Result Preview
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.3 }}>
          {resultImage ? 'Your virtual try-on result' : 'Your result will appear here'}
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          border: resultImage ? 'none' : '2px dashed',
          borderColor: isHovered ? borderColor : 'divider', // 🟢 Match border color on hover
          borderRadius: '12px',  // 🟢 Consistent with the container
          p: 4,
          textAlign: 'center',
          minHeight: 350,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          mb: 2,
          transition: 'all 0.3s ease',
          backgroundColor: isHovered ? theme.palette.background.paper : 'transparent',
          '&:hover': {
            backgroundColor: theme.palette.background.paper,
            borderColor: borderColor,
          }
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Generating your virtual try-on...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="body1" color="error" gutterBottom>
              {error}
            </Typography>
          </Box>
        ) : resultImage ? (
          <img 
            src={resultImage} 
            alt="Try-on result" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '350px',
              objectFit: 'contain',
              borderRadius: '12px',  // 🟢 Ensure image matches container
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}
          />
        ) : (
          <>
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                fontSize: '3rem',
                color: borderColor,
                opacity: 0.7,
              }}
            >
              🖼️
            </Box>
            <Typography variant="body1" sx={{ color: 'text.hint', fontSize: '1rem', textAlign: 'center', lineHeight: 1.6 }}>
              Upload model and clothing images,<br />
              then click "Generate"
            </Typography>
          </>
        )}
      </Box>
      
      <Fade in={Boolean(resultImage)}>
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ 
            visibility: resultImage ? 'visible' : 'hidden',
            height: resultImage ? 'auto' : 0,
            opacity: resultImage ? 1 : 0
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              borderRadius: '20px',  // 🟢 Rounded buttons
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }
            }}
          >
            Download
          </Button>
        </Stack>
      </Fade>
    </Paper>
  );
};

export default ResultBox;
