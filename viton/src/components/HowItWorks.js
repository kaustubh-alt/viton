import React from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Button, 
  useTheme 
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";

/**
 * HowItWorks Component
 * Displays the virtual try-on process with an enhanced UI.
 * 
 * @param {function} onClose - Function to close modal (if applicable)
 * @param {boolean} isModal - Whether displayed in a modal
 */
const HowItWorks = ({ onClose, isModal = false }) => {
  const theme = useTheme();

  const steps = [
    {
      title: "Upload Model Image",
      description: "Upload a full-body photo of a person standing in a neutral pose. For best results, use a clear image with good lighting and a simple background.",
      color: theme.palette.primary.main,
      icon: <PersonIcon fontSize="large" />
    },
    {
      title: "Upload Clothing Item",
      description: "Upload an image of the clothing item you want to try on. The image should show the entire garment clearly against a plain background.",
      color: theme.palette.secondary.main,
      icon: <CheckroomIcon fontSize="large" />
    },
    {
      title: "Generate Try-On",
      description: "Click the Generate Try-On button and our AI will process your images. In seconds, you'll see a realistic preview of how the clothing would look on the model.",
      color: theme.palette.success.main,
      icon: <AutoAwesomeIcon fontSize="large" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}20, ${theme.palette.secondary.light}10)`,
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.1)`, // Adjusted for a crisp look
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.dark,
              mb: 2,
              position: "relative",
              "&::after": {
                content: '""',
                display: "block",
                width: "90px",
                height: "4px",
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                margin: "8px auto 0",
                borderRadius: "2px",
              }
            }}
          >
            How It Works
          </Typography>
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ color: theme.palette.text.secondary, mb: 4 }}
          >
            Try on clothes virtually with our AI-powered experience.
          </Typography>

          {/* Steps Section */}
          <Grid container spacing={4} justifyContent="center">
            {steps.map(({ title, description, color, icon }, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  transition={{ duration: 0.3 }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      borderRadius: 3,
                      borderTop: `4px solid ${color}`,
                      boxShadow: `0px 4px 12px ${color}50`,
                      transition: "all 0.3s",
                      height: "270px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: `0px 8px 20px ${color}80`,
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "50%",
                        bgcolor: color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        boxShadow: `0px 5px 15px ${color}40`,
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.primary.dark,
                        mb: 1
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      {description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Technology Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              elevation={2}
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                borderLeft: `5px solid ${theme.palette.primary.main}`,
                boxShadow: `0px 5px 12px ${theme.palette.primary.main}40`,
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: `0px 8px 20px ${theme.palette.primary.main}70`,
                }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ fontWeight: 600, color: theme.palette.primary.dark, mb: 1 }}
              >
                The Technology Behind It
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our Virtual Cloth Try-On uses advanced computer vision and deep learning algorithms to 
                analyze both the model and clothing images. The system identifies body posture, 
                measurements, and clothing characteristics to create a realistic visualization of how 
                the garment would fit on the person. This technology helps shoppers make more confident 
                purchasing decisions without physically trying on clothes.
              </Typography>
            </Paper>
          </motion.div>

          {/* Call-to-Action (Only in Modal) */}
          {isModal && (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onClose}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  fontSize: "1rem",
                  borderRadius: "50px",
                  boxShadow: `0px 6px 16px ${theme.palette.primary.main}50`,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0px 10px 24px ${theme.palette.primary.main}80`,
                  }
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default HowItWorks;
