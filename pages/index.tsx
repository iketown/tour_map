import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  Container,
  Box,
} from "@mui/material";
import type { NextPage } from "next";
import Layout from "~/layout/Layout";
import Link from "~/components/Link";
import { useRouter } from "next/router";
import NextImage from "next/image";
const Home: NextPage = () => {
  const { push } = useRouter();
  return (
    <Container>
      <Box
        sx={{
          width: "60vw",
          height: "60vw",
          position: "relative",
          mx: "auto",
          mt: "10vh",
        }}
      >
        <NextImage src={"/images/tourmap_logo.png"} layout="fill" />
      </Box>
    </Container>
  );
};

export default Home;
