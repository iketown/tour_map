import React, { useState } from "react";
import { Button, Typography, Box, Stack, Tabs, Tab } from "@mui/material";
import PoiList from "./PoiList";
import AirportList from "./AirportList";
import { useSelector } from "@xstate/react";
import { useMapboxCtx } from "~/contexts/MapboxCtx";
import DataView from "../../../../components/DataView";

const MapViewTabs = () => {
  const [tabValue, setTabValue] = useState("Schedule");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const { mapService } = useMapboxCtx();
  const mapAirports = useSelector(
    mapService,
    ({ context }) => context.mapAirports
  );
  return (
    <Box sx={{ width: "100%" }}>
      <Tabs centered value={tabValue} onChange={handleChange}>
        {["Schedule", "Airports", "Hotels", "Pois"].map((tabVal) => {
          return <Tab key={tabVal} value={tabVal} label={tabVal} />;
        })}
      </Tabs>
      {tabValue === "Pois" && <PoiList />}
      {tabValue === "Airports" && <AirportList />}
      <pre style={{ fontSize: 10, color: "purple", margin: "1rem" }}>
        {tabValue}
      </pre>
      <DataView data={mapAirports} title="mapAirports" />
    </Box>
  );
};

export default MapViewTabs;
