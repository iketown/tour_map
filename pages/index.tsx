import { Typography, List, ListItem, ListItemButton } from "@mui/material";
import type { NextPage } from "next";
import Layout from "~/layout/Layout";
import Link from "~/components/Link";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { push } = useRouter();
  return (
    <Layout>
      <h2>Firebase, MUI NextJS starter</h2>
      <List>
        <ListItemButton onClick={() => push("/auth")}>
          1. Sign Up or Sign In
        </ListItemButton>
        <ListItemButton onClick={() => push("/votes")}>
          2. Cast your vote
        </ListItemButton>
        <ListItemButton onClick={() => push("/ssuser")}>
          3. see if you're being authed on serverside
        </ListItemButton>
        <ListItemButton onClick={() => push("/ssdocs")}>
          4. see if docs being loaded server side
        </ListItemButton>
      </List>
    </Layout>
  );
};

export default Home;
