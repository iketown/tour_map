import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField } from "@mui/material";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import type { FC } from "react";
import React from "react";

interface DateTimePickerI {
  value: Date;
  onChange: (date: Date | null) => void;
  label: string;
  timeZone?: string;
}

export const DatePickerInput: FC<DateTimePickerI> = ({
  value,
  onChange,
  label,
  timeZone,
}) => {
  const handleChange = (date: Date | null) => {
    if (date && date.getTime()) {
      if (timeZone) {
        onChange(zonedTimeToUtc(date, timeZone));
      } else {
        onChange(date);
      }
    }
  };
  const date = new Date(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={
          timeZone && date.getTime() ? utcToZonedTime(date, timeZone) : value
        }
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
