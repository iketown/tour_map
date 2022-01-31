import React from "react";
import Layout from "~/layout/Layout";
import { Button, List, ListItemButton, Box } from "@mui/material";
import LinkButton from "~/components/LinkButton";

const ToursIndex = () => {
  return (
    <Layout>
      tours index
      <Box sx={{ p: 2 }}>
        <LinkButton variant="contained" size="large" href="/admin/tours/add">
          Create a Tour
        </LinkButton>
      </Box>
    </Layout>
  );
};

export default ToursIndex;
