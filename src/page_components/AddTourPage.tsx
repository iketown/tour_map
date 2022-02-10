import React from "react";
import Layout from "~/layout/Layout";
import TourForm from "~/components/forms/tour_form/AddTourForm";
import { Typography } from "@mui/material";

//
//
const AddTourPage = () => {
  return (
    <Layout>
      <h2>Create a tour</h2>

      <TourForm />
    </Layout>
  );
};

export default AddTourPage;
