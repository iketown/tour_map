import React, { useState } from "react";
import { Button, Grid, Drawer } from "@mui/material";

import { fakeInitValues, hollywood } from "./fakeInitValue";
import { useFormState, useForm, useField } from "react-final-form";
import { CopyToClipboard } from "react-copy-to-clipboard";
const FakeInfoButtons = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    input: { value: time_zone },
  } = useField("time_zone");
  const { values } = useFormState();
  const { initialize } = useForm();
  const handleIridium = () => {
    initialize(fakeInitValues);
  };
  const handleSF = () => {
    initialize(hollywood);
  };
  return (
    <>
      <Grid item xs={12}>
        <Button variant="outlined" onClick={handleIridium}>
          load iridium
        </Button>
        <Button variant="outlined" onClick={handleSF}>
          load SF
        </Button>
        <Button
          onClick={() => {
            setDrawerOpen(true);
          }}
        >
          info drawer
        </Button>
        <CopyToClipboard text={JSON.stringify(values, null, 2)}>
          <Button>copy form values</Button>
        </CopyToClipboard>
      </Grid>
      <Drawer
        sx={{ maxWidth: "70vw" }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <pre style={{ fontSize: 10, color: "navy" }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </Drawer>
    </>
  );
};

export default FakeInfoButtons;
