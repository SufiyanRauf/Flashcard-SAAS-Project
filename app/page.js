"use client";
import {
  Box,
  Button,
  Container,
  Grid,
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
    description: "Paste in any text, like lecture notes or an article. That is the only step you do yourself.",
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: "AI Generates the Cards",
    description: "It reads through your text and turns the main points into question-and-answer flashcards.",
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: "Study Anywhere",
    description: "Your decks are saved to your account, so you can open them on any device.",
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

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            pt: { xs: 4, md: 6 }, // Reduced top padding
            pb: { xs: 8, md: 10 },
            px: 2,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Turn Your Notes into Knowledge.
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}>
            Paste in your notes and it turns them into flashcards you can study.
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
            {features.map((feature) => (
              <Paper
                key={feature.title}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  flex: '1 1 0',
                  minWidth: 240,
                  maxWidth: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </Paper>
            ))}
          </Box>
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