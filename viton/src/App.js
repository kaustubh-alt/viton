import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import VirtualTryOn from './components/VirtualTryOn';
import Header from './components/Header';
import Footer from './components/Footer';
import HowItWorks from './components/HowItWorks';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Container, Box, Modal, Backdrop, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: { main: '#6200ea' },
    secondary: { main: '#03dac6' },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)' },
      },
    },
  },
});

// ScrollToSection component to handle hash navigation
const ScrollToSection = () => {
  const { hash, pathname } = useLocation();
  
  useEffect(() => {
    // Only proceed if we have a hash and we're on the home page (with or without authentication)
    if (hash && (pathname === '/' || pathname === '')) {
      // Remove the '#' character
      const id = hash.replace('#', '');
      
      // Wait for DOM to be ready
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // Scroll to the element
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Add focus for accessibility
          element.setAttribute('tabindex', '-1');
          element.focus({ preventScroll: true });
          
          // Add a class to highlight the section briefly
          element.classList.add('highlight-section');
          setTimeout(() => {
            element.classList.remove('highlight-section');
          }, 2000);
        } else {
          console.log(`Element with id "${id}" not found`);
        }
      }, 500);
    }
  }, [hash, pathname]);
  
  return null;
};

function App() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Effect to disable body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = showHowItWorks ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showHowItWorks]);

  const handleOpenHowItWorks = () => {
    // Check if we're on any page that has the main application content
    // This works for both authenticated and unauthenticated states
    if (window.location.pathname === '/' || window.location.pathname === '') {
      // Improved scroll functionality
      const howItWorksSection = document.getElementById('how-it-works');
      if (howItWorksSection) {
        // First ensure we're at the right URL
        window.history.pushState({}, '', '/#how-it-works');
        
        // Then scroll with a slight delay to ensure DOM is ready
        setTimeout(() => {
          howItWorksSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          
          // Add focus to the section for accessibility
          howItWorksSection.setAttribute('tabindex', '-1');
          howItWorksSection.focus({ preventScroll: true });
        }, 100);
      } else {
        console.log('How It Works section not found in the DOM');
      }
    } else {
      setShowHowItWorks(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <ScrollToSection />
          <Box 
            sx={{ 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'visible', // Allow content to overflow for scrolling
            }}
          >
            <Header onHowItWorksClick={handleOpenHowItWorks} />
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route 
                  path="/" 
                  element={
                    <Container 
                      maxWidth="lg" 
                      sx={{ 
                        flexGrow: 1, 
                        py: 4,
                        overflow: 'visible', // Allow content to overflow for scrolling
                        height: 'auto', // Let content determine height
                      }}
                    >
                      <VirtualTryOn />
                    </Container>
                  } 
                />
              </Route>
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            
            <Footer />
            
            {/* How It Works Modal for non-home pages */}
            <Modal
              open={showHowItWorks}
              onClose={() => setShowHowItWorks(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{ timeout: 500 }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'auto' // Allow scrolling if content is too large
              }}
            >
              <Fade in={showHowItWorks}>
                <Box sx={{ 
                  outline: 'none', 
                  width: '90%', 
                  maxWidth: '1200px', // Match the typical Container maxWidth="lg" size
                  minHeight: 'auto', // Allow content to determine height
                  maxHeight: '90vh', // Prevent from being too tall
                  overflow: 'auto', // Enable scrolling if needed
                  p: 3,
                  position: 'relative',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  m: 2,
                  transform: 'scale(1.05)', // Match the 5% size increase from the main page
                  transformOrigin: 'center top',
                  '& .MuiContainer-root': { 
                    height: 'auto',
                    width: '100%'
                  }
                }}>
                  <IconButton
                    aria-label="close"
                    onClick={() => setShowHowItWorks(false)}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: 16,
                      color: 'grey.500',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      zIndex: 10,
                      '&:hover': {
                        color: 'grey.800',
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  {/* Use isModal=false to match the main page version */}
                  <HowItWorks onClose={() => setShowHowItWorks(false)} isModal={false} scale={1} />
                </Box>
              </Fade>
            </Modal>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 