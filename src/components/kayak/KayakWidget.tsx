import React, { useRef, useEffect } from "react";
import Script from "next/script";
import { Button, Box } from "@mui/material";

const KayakWidget = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    //@ts-ignore
    const KAYAK = window?.KAYAK;
    KAYAK.embed({
      container: divRef.current,
      defaultProduct: "flights",
      affiliateId: "242726",
      origin: "JFK",
      destination: "LAX",
      startDate: "2022-02-20",
      endDate: "2022-02-20",
      tripType: "ow", //  or 'rt'
    });
  };
  return (
    <>
      <Script
        src="https://www.kayak.com/affiliate/widget-v2.js"
        type="text/JavaScript"
      />
      <div>KayakWidget</div>
      <Box sx={{ p: 2 }}>
        <Box
          ref={divRef}
          sx={{
            position: "relative",
            width: 400,
            height: 400,
            border: "1px solid purple",
          }}
        />
        <Button onClick={handleOpen}>open</Button>
      </Box>
    </>
  );
};

export default KayakWidget;
