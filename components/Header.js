"use client";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backgroundColor: '#f5f3f7', borderBottom: '1px solid #e6e1ee' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}
          >
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
  );
}