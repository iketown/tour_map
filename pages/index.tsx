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
          minWidth: "50vw",
          minHeight: "50vh",
          position: "relative",
          mx: "auto",
          mt: "10vh",
        }}
      >
        <NextImage src={"/images/toursync_logo.svg"} layout="fill" />
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          mt: 2,
          color: (t) => t.palette.primary.dark,
        }}
        variant="subtitle1"
      >
        group travel, simplified
      </Typography>
    </Container>
  );
};

export default Home;
