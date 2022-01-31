import React, { useState } from "react";
import {
  Switch,
  IconButton,
  Drawer,
  FormControlLabel,
  Box,
  Tooltip,
} from "@mui/material";
import { useFormState } from "react-final-form";
import { DataObject } from "@mui/icons-material";

const FormValueView = () => {
  const { values } = useFormState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <Box textAlign={"right"}>
      <Drawer
        sx={{ px: 2 }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <pre style={{ fontSize: 12 }}>{JSON.stringify(values, null, 2)}</pre>
      </Drawer>
      <Tooltip title="view form values">
        <IconButton color="primary" onClick={() => setDrawerOpen(true)}>
          <DataObject />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FormValueView;
