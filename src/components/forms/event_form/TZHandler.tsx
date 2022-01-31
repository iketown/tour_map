import React, { useEffect } from "react";

import { useField, useForm } from "react-final-form";
import { Typography } from "@mui/material";
import { getTimeZone } from "./getTimeZone";

import { formatInTimeZone, format } from "date-fns-tz";

type TZResponse = {
  dstOffset: number; // 3600;
  rawOffset: number; // -21600;
  status: string; // "OK";
  timeZoneId: string; // "America/Chicago";
  timeZoneName: string; // "Central Daylight Time";
};

const TZDisplay = () => {
  const {
    input: { value: placeValue },
    meta: placeMeta,
  } = useField<Place>("place");
  const {
    input: { value: dateValue },
  } = useField<Date>("starts_at");

  const {
    input: { onChange: changeSameTZ },
  } = useField("isSameTZ");

  const {
    input: { value: tzValue, onChange: tzOnChange },
    meta: tzMeta,
  } = useField("time_zone");

  useEffect(() => {
    if (!placeValue || !dateValue) return;
    // if location changes update timezone.
    const { lat, lng } = placeValue;
    const timestamp = dateValue.valueOf() / 1000;
    if (lat && lng && timestamp) {
      getTimeZone({ lat, lng, timestamp }).then((res: TZResponse) => {
        if (res.status === "OK") {
          const { dstOffset, rawOffset, timeZoneId, timeZoneName } = res;
          tzOnChange({ dstOffset, rawOffset, timeZoneId, timeZoneName });
        }
      });
    }
  }, [placeValue, dateValue]);

  useEffect(() => {
    if (tzValue && tzValue.timeZoneId) {
      const now = new Date();
      const formatStr = "yyyy-MM-dd hh:mm aa ";
      const timeHere = format(now, formatStr);
      const timeThere = formatInTimeZone(now, tzValue.timeZoneId, formatStr);
      changeSameTZ(timeHere === timeThere);
    }
  }, [tzValue]);

  return (
    <Typography variant="caption" color="GrayText">
      {tzValue.timeZoneName}
    </Typography>
  );
};

export default TZDisplay;
