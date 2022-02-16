import React, { useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  Divider,
  Container,
  Box,
} from "@mui/material";

interface DataViewI {
  data: any;
  title: string;
}
const DataView: React.FC<DataViewI> = ({ data, title }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <Box component="span" mx={1}>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={() => setDrawerOpen(true)}
      >
        {title}
      </Button>
      <Drawer
        sx={{ p: 3 }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Typography variant="h5" textAlign={"center"}>
          {title}
        </Typography>
        <Divider />
        <Container>
          <pre style={{ fontSize: 11, maxWidth: "70vw" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
          <Button
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            close
          </Button>
        </Container>
      </Drawer>
    </Box>
  );
};

export default DataView;
