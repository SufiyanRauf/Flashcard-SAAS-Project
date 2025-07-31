"use client";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Results() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/checkout/sessions?session_id=${sessionId}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error.message);
        }
      } catch (e) {
        setError("An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [sessionId]);

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="error">
          Error
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