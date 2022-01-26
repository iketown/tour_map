import * as React from "react";
import type { NextPage } from "next";
import { Button, Container, Typography, Box } from "@mui/material";
import Link from "~/components/Link";
import ProTip from "~/components/ProTip";
import Copyright from "~/components/Copyright";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";
import { app, db } from "~/utils/firebase/clientApp";

const Home: NextPage = () => {
  // Destructure user, loading, and error out of the hook.
  const [user, loading, error] = useAuthState(getAuth(app));
  const [votes, votesLoading, votesError] = useCollection(
    collection(db, "votes")
  );
  if (!votesLoading && votes) {
    votes.docs.map((doc) => console.log(doc.data()));
  }
  // console.log the current user and loading status
  console.log("Loading:", loading, "|", "Current user:", user);
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <Button variant="outlined" component={Link} href="/votes">
          Vote
        </Button>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
};

export default Home;
