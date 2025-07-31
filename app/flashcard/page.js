"use client";
import { Suspense } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";

// This component contains the logic that uses searchParams
function FlashcardGrid() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    const getFlashcard = async () => {
      if (!user || !search) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcardsData = [];
      docs.forEach((doc) => {
        flashcardsData.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcardsData);
    };
    if (isSignedIn) {
      getFlashcard();
    }
  }, [user, search, isSignedIn]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <CardActionArea onClick={() => handleCardClick(index)}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    perspective: "1000px",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    position: "relative",
                    width: "100%",
                    height: "200px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    transform: flipped[index]
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {flashcard.front}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 2,
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {flashcard.back}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  );
}

// The main page now wraps the component in Suspense
export default function FlashcardPage() {
  return (
    <Container sx={{ width: "100vw" }}>
      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>}>
        <FlashcardGrid />
      </Suspense>
    </Container>
  );
}