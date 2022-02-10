import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import { useTourCtx } from "~/contexts/TourCtx";
import DataView from "~/components/DataView";

interface LegModalI {
  event_id: string;
}
const LegModal: React.FC<LegModalI> = ({ event_id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { tourInfo, tour_id } = useTourCtx();
  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = () => {
    setModalOpen(true);
  };
  return (
    <>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogContent>
          <Typography>Start a new Leg with {event_id}?</Typography>
        </DialogContent>
        <DialogActions>
          <DataView data={tourInfo} title="tourInfo" />
        </DialogActions>
      </Dialog>
      <Button onClick={handleOpen}>Start of New Leg</Button>
    </>
  );
};

export default LegModal;
