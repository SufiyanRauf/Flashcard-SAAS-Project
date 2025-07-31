"use client";
import { Suspense } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// This new component contains all the logic that depends on the URL.
function ResultsDisplay() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!sessionId) {
        setLoading(false);
        setError("Session ID not found.");
        return;
      }
      try {
        const res = await fetch(`/api/checkout/sessions?session_id=${sessionId}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error.message);
        }
      } catch (e) {
        setError("An error occurred while fetching the session.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [sessionId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verifying your payment...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="error">
          Payment Error
        </Typography>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (session && session.payment_status === "paid") {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Thank you for purchasing!</Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Session ID:</Typography>
          <Typography variant="body1">{session.id}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            We have received your payment. You will receive an email with the
            order details shortly.
          </Typography>
        </Box>
      </Container>
    );
  } else {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Payment Failed</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Your payment was not successful. Please try again.
        </Typography>
      </Container>
    );
  }
}

// The main page component now wraps the logic in a Suspense boundary.
export default function Results() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>}>
      <ResultsDisplay />
    </Suspense>
  );
}