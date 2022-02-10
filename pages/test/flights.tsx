import React from "react";
import Layout from "~/layout/Layout";
import { Button } from "@mui/material";
import axios from "axios";

const FlightTest = () => {
  const callApi = () => {
    axios.get("/api/amadeus").then((res) => {
      console.log("response", res.data);
    });
  };
  return (
    <Layout>
      <Button variant="outlined" onClick={callApi}>
        get it
      </Button>
    </Layout>
  );
};

export default FlightTest;
