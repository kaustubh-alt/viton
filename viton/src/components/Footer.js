import React from 'react';
import { Box, Container, Typography, Link, IconButton, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        mt: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Virtual Cloth Assistant. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, my: { xs: 2, md: 0 } }}>
            <Link href="#" color="inherit" underline="hover">Privacy</Link>
            <Link href="#" color="inherit" underline="hover">Terms</Link>
            <Link href="#" color="inherit" underline="hover">Contact</Link>
          </Box>
          
          <Box>
            <IconButton aria-label="github" size="small">
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="linkedin" size="small">
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="twitter" size="small">
              <TwitterIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 