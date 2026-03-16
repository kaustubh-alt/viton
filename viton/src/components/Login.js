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
 * Login Component
 * Handles user authentication with form validation
 */
const Login = () => {
  // Hooks
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  // Destructure form data for convenience
  const { email, password } = formData;
  
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
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      // For demo purposes, accept any login
      const shld = await login(email,password);
      if (shld){
        navigate('/');
      }else{
        setError("Invalid Credentials")
      }
      console(shld)
      if (shld){navigate("/")}
    } catch (error) {
      setError('Failed to log in. Please try again.');
    }
  };

  // Common styles
  const textFieldStyles = { mb: 2 };
  const linkStyles = { 
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  };

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
      {/* Login form container */}
      <Container maxWidth="xs" sx={{ width: '100%' }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            borderTop: `4px solid ${theme.palette.primary.main}`,
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
              color: theme.palette.primary.main,
              mb: 4
            }}
          >
            Login
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
          
          {/* Login form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Username field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type='email'
              autoComplete=""
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            
            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              LOGIN
            </Button>
            
            {/* Additional links */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              {/* Forgot password link */}
              <Link 
                href="#" 
                variant="body2"
                sx={linkStyles}
                onClick={(e) => {
                  e.preventDefault();
                  // Handle forgot password
                }}
              >
                Forgot Password?
              </Link>
              
              {/* Registration link */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="body2" display="inline" sx={{ mr: 1 }}>
                  New user?
                </Typography>
                <Link 
                  href="#" 
                  variant="body2"
                  sx={{ 
                    ...linkStyles,
                    fontWeight: 600
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                >
                  Create your Account
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 