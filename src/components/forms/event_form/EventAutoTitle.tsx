import React, { useCallback, useEffect, useState } from "react";
import { TextField, Typography, CardHeader, Box } from "@mui/material";
import { formatInTimeZone } from "date-fns-tz";
import { useField, Field } from "react-final-form";
import TextOrField from "~/components/TextOrField";

const EventAutoTitle = () => {
  const {
    input: { value: placeValue },
  } = useField<Place>("place");
  const {
    input: { value: starts_at },
  } = useField<Date>("starts_at");
  const {
    input: { value: time_zone },
  } = useField("time_zone");
  const { input: titleInput, meta: titleMeta } = useField("title");
  const getAutoTitle = useCallback(() => {
    const name = placeValue?.name;
    const city = placeValue?.cityObj?.short_name;
    const date =
      starts_at && new Date(starts_at)?.getTime()
        ? formatInTimeZone(new Date(starts_at), time_zone.timeZoneId, "MMM dd")
        : "";
    const autoTitle = [date, city, name].join(" • ");
    return autoTitle;
  }, [placeValue, starts_at, time_zone]);

  useEffect(() => {
    const autoTitle = getAutoTitle();
    if (titleInput.value === autoTitle) return;
    titleInput.onChange(autoTitle);
  }, [titleInput, titleMeta, getAutoTitle]);
  return <CardHeader title={titleInput.value} />;
};

export default EventAutoTitle;
