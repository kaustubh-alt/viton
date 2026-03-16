import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField,
  Button,
  Container,
  Link,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Register Component
 * Handles user registration functionality with form validation
 */
const Register = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  // Destructure form data for convenience
  const { username, email, password, confirmPassword } = formData;
  
  /**
   * Handle input changes for all form fields
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  /**
   * Form submission handler with validation
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setError('');
    
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      // Wait for the register function to complete
      const success = await register(username, email, password);
    
      console.log("Registration status:", success); // Debugging output
    
      if (success) {
        navigate('/');
      } else {
        setError("Error Occurred");
      }
    } catch (error) {
      setError("Failed to register. Please try again.");
    }
    
  };

  // Common styles
  const textFieldStyles = { mb: 2 };
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        py: 4
      }}
    >
      {/* Registration form container */}
      <Container maxWidth="sm" sx={{ width: '500px' }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            borderTop: `4px solid ${theme.palette.secondary.main}`,
          }}
        >
          {/* Form title */}
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: theme.palette.secondary.main,
              mb: 4
            }}
          >
            Register
          </Typography>
          
          {/* Error message display */}
          {error && (
            <Typography 
              color="error" 
              variant="body2" 
              align="center" 
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}
          
          {/* Registration form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            
            {/* Email field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              value={email}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            
            {/* Password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={handleChange}
              sx={textFieldStyles}
            />
            
            {/* Confirm password field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            
            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              REGISTER
            </Button>
            
            {/* Login link */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
              <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
                Already a member?
              </Typography>
              <Link 
                href="#" 
                variant="body2"
                sx={{ 
                  color: theme.palette.secondary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register; 