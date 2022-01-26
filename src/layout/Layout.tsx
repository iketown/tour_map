import React from "react";

import type { FC } from "react";
import { Container } from "@mui/material";

import NavBar from "./NavBar";

const Layout: FC = ({ children }) => {
  return (
    <div>
      <NavBar />
      <Container maxWidth="lg">{children}</Container>
    </div>
  );
};

export default Layout;
