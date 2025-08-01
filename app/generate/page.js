"use client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `An error occurred: ${res.statusText}`);
      }

      const data = await res.json();
      setFlashcards(data.flashcards);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("A flashcard collection with the same name already exists.");
        return;
      }
      collections.push({ name });
      batch.set(userDocRef, { flashcards: collections }, { merge: true });
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((card) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, card);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  if (!isLoaded) return null;

  return (
    <Container>
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Generate Flashcards
        </Typography>
        <Typography variant="body1" gutterBottom>
          Generates 10 flashcards.
        </Typography>
        <Paper sx={{ p: 2 }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Generate Flashcards"}
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Flashcards Preview
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardActionArea
                  onClick={() => handleCardClick(index)}
                  sx={{ borderRadius: 4 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      transformStyle: "preserve-3d",
                      transition: "transform 0.7s",
                      transform: flipped[index] ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    <CardContent
                      sx={{
                        padding: 0,
                        "&:last-child": { paddingBottom: 0 },
                        backfaceVisibility: "hidden",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          p: 3,
                          height: "250px",
                          backgroundColor: "background.paper",
                          borderRadius: "inherit",
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {flashcard.front}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardContent
                      sx={{
                        padding: 0,
                        "&:last-child": { paddingBottom: 0 },
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          p: 3,
                          height: "250px",
                          backgroundColor: "primary.light",
                          color: "primary.contrastText",
                          borderRadius: "inherit",
                        }}
                      >
                        <Typography variant="h6" component="div">
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpen}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Collection Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}