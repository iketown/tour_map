import React from "react";
import type { FC } from "react";
import { Container, Box, Button, Grid } from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import { useAuth } from "~/hooks/auth/useAuth";
import Layout from "~/layout/Layout";

const VotesIndex: FC = () => {
  const [user, loading, error] = useAuth();
  console.log("Loading:", loading, "|", "Current user:", user);

  return (
    <Layout>
      <Grid container sx={{ mt: 3 }}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button startIcon={<Check />} variant="outlined">
            🍍🍕
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Button color="error" startIcon={<Clear />} variant="outlined">
            🍍🍕
          </Button>
        </Grid>
        <Grid item xs={12}>
          <pre style={{ fontSize: 10, maxWidth: "100vw", overflow: "scroll" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default VotesIndex;
