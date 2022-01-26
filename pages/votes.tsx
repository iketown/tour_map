import React from "react";
import type { FC } from "react";
import { Container, Box, Button, Grid } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

import { collection, doc, setDoc } from "firebase/firestore";

import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Layout from "~/layout/Layout";
import { db } from "~/utils/firebase/clientApp";
import { useAuthCtx } from "../src/contexts/AuthCtx";

const VotesIndex: FC = () => {
  const { user, loading, error } = useAuthCtx();

  const [collValues, collLoading, collError, collSnap] = useCollectionData(
    collection(db, "votes")
  );
  const [coll, collL, collE] = useCollection(collection(db, "votes"));

  const handleVote = (vote: boolean) => {
    const voter_id = user?.uid;
    const email = user?.email;
    if (!voter_id) return;
    setDoc(
      doc(db, "votes", voter_id),
      { voter_id, vote, email },
      { merge: true }
    );
  };

  return (
    <Layout>
      <Grid container sx={{ mt: 3 }} spacing={2}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={() => handleVote(true)}
            startIcon={<Check />}
            variant="outlined"
          >
            🍍🍕
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            onClick={() => handleVote(false)}
            color="error"
            startIcon={<Clear />}
            variant="outlined"
          >
            🍍🍕
          </Button>
        </Grid>
        <Grid item xs={12}>
          <pre style={{ fontSize: 10, maxWidth: "100vw", overflow: "scroll" }}>
            {JSON.stringify(collValues, null, 2)}
          </pre>
        </Grid>
        <Grid item xs={12}>
          {user ? <div>user: {user.email}</div> : <div>no user</div>}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default VotesIndex;
