"use client";
import { createTheme } from "@mui/material/styles";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#673ab7", // A deep, friendly purple
    },
    secondary: {
      main: "#ffeb3b", // A bright, energetic yellow for contrast
    },
    background: {
      default: "#f5f3f7", // A very light lavender for a soft background
      paper: "#ffffff",
    },
    text: {
      primary: "#333",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: {
      fontFamily: poppins.style.fontFamily,
      fontWeight: 700,
      fontSize: "3.5rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontFamily: poppins.style.fontFamily,
      fontWeight: 700,
      fontSize: "3rem",
    },
    h4: {
      fontFamily: poppins.style.fontFamily,
      fontWeight: 600,
      fontSize: "2.125rem",
    },
    h5: {
        fontFamily: poppins.style.fontFamily,
        fontWeight: 600,
    },
    h6: {
        fontFamily: poppins.style.fontFamily,
        fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 16, // Softer corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
          boxShadow: 'none',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #7e57c2 30%, #673ab7 90%)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 20px rgba(103, 58, 183, 0.4)',
          }
        }
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)", // Softer shadows
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                },
            }
        }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
});

export default theme;