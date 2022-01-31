import React from "react";
import Layout from "~/layout/Layout";
import TourForm from "~/components/forms/tour_form/TourForm";

//
//
const AddTourPage = () => {
  return (
    <Layout>
      <h2>Add Tour</h2>
      <TourForm />
    </Layout>
  );
};

export default AddTourPage;
