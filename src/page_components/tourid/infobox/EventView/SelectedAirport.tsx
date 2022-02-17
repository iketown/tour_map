import React from "react";
import { Button } from "@mui/material";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import { useSelector } from "@xstate/react";

const SelectedAirport = () => {
  const { mapService } = useMapboxCtx();
  const selectedAirportId = useSelector(
    mapService,
    ({ context }) => context.selectedAirportId
  );
  const airports = useSelector(
    mapService,
    ({ context }) => context.mapAirports?.airports || null
  );
  const selectedAP =
    airports && selectedAirportId ? airports[selectedAirportId] : null;
  if (!selectedAP) return null;
  return (
    <div>
      <Button variant="outlined">fly IN to {selectedAP.iata_code}</Button>
      <Button variant="outlined">fly OUT of {selectedAP.iata_code}</Button>
    </div>
  );
};

export default SelectedAirport;
