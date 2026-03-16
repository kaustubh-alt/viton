import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, useTheme, useMediaQuery, Avatar, Menu, MenuItem } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ onHowItWorksClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <CheckroomIcon sx={{ color: theme.palette.primary.main, fontSize: 36, mr: 1 }} />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Virtual Cloth Assistant
          </Typography>
        </Box>
        
        {!isMobile && (
          <Box display="flex" alignItems="center">
            <Button 
              color="primary" 
              sx={{ mx: 1 }}
              onClick={onHowItWorksClick}
              startIcon={<InfoIcon />}
            >
              How It Works
            </Button>
            
            {currentUser && (
              <>
                <Button 
                  color="primary"
                  onClick={handleMenuOpen}
                  startIcon={
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem'
                      }}
                    >
                      {currentUser && currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "?"}
                    </Avatar>

                  }
                  sx={{ ml: 2 }}
                >
                  {currentUser.username}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
            
            {!currentUser && (
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ ml: 2 }}
                onClick={() => navigate('/login')}
                startIcon={<AccountCircleIcon />}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 