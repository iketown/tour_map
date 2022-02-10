import React from "react";
import Layout from "~/layout/Layout";
import { Button } from "@mui/material";
import LinkButton from "~/components/LinkButton";

const AdminIndex = () => {
  return (
    <Layout>
      <h1>Admin</h1>
      <LinkButton href="/admin/calendars">Calendars</LinkButton>
    </Layout>
  );
};

export default AdminIndex;
