import React from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Box, Divider, Typography } from "@mui/material";

interface DateIconI {
  date: number | Date;
  tz: string;
}
const DateBox: React.FC<DateIconI> = ({ date, tz }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "3rem",
        borderRadius: "4px",
      }}
      boxShadow={2}
    >
      <Typography
        variant="h6"
        color="HighlightText"
        sx={{ mb: "-7px", fontSize: 17 }}
      >
        {formatInTimeZone(date, tz, "eee").toUpperCase()}
      </Typography>
      {/* <Divider sx={{ width: "100%" }} /> */}
      <Box>
        <Typography variant="caption">
          {formatInTimeZone(date, tz, "MMM d")}
        </Typography>
      </Box>
    </Box>
  );
};

export default DateBox;
