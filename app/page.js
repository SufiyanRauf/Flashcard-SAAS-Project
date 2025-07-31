"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import Head from "next/head";
import getStripe from "@/utils/get-stripe";

// Icons for the features section
import EditNoteIcon from '@mui/icons-material/EditNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DevicesIcon from '@mui/icons-material/Devices';

const features = [
  {
    icon: <EditNoteIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: "Paste Your Notes",
    description: "Simply paste any text—from lecture notes to articles—and let our AI do the rest.",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: "AI-Powered Magic",
    description: "Our smart AI analyzes your text and generates clear, concise flashcards in seconds.",
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: "Study Anywhere",
    description: "Access your flashcards on any device, making it easy to study on the go.",
  },
];

export default function Home() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const checkoutSession = await fetch("/api/checkout/sessions", {
      method: "POST",
    });
    const checkoutSessionJSON = await checkoutSession.json();
    if (checkoutSession.status === 500) {
      console.error(checkoutSessionJSON.error);
      return;
    }
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id,
    });
    console.warn(error.message);
  };

  return (
    <>
      <Head>
        <title>SparkCards</title>
        <meta name="description" content="AI-Powered Flashcard Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="sticky" color="transparent">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              SparkCards
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button variant="contained" href="/sign-up" sx={{ ml: 2 }}>
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 2,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Turn Your Notes into Knowledge.
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}>
            The smartest way to create flashcards. Paste your text, and let our AI handle the rest.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/generate"
          >
            Create Flashcards Now
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ my: 10 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                  <Typography color="text.secondary">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Pricing Section */}
        <Box sx={{ my: 10, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 6 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" gutterBottom>Basic</Typography>
                <Typography variant="h4" component="div" gutterBottom>
                  Free
                </Typography>
                <Typography color="text.secondary" sx={{ minHeight: '72px' }}>
                  Access to basic flashcard features and up to 10 study sets.
                </Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 3 }} href="/generate">
                  Start Learning
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 4, border: '2px solid', borderColor: 'primary.main', height: '100%' }}>
                <Typography variant="h5" gutterBottom>Pro</Typography>
                <Typography variant="h4" component="div" gutterBottom>$5<span style={{ fontSize: '1rem', color: '#5f6368' }}>/mo</span></Typography>
                <Typography color="text.secondary" sx={{ minHeight: '72px' }}>
                  Unlimited flashcards, unlimited study sets, and priority support.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}