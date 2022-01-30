import React from "react";
import type { FC } from "react";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TimePicker from "@mui/lab/TimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { TextField, Typography, Box } from "@mui/material";
import {
  formatInTimeZone,
  utcToZonedTime,
  zonedTimeToUtc,
  getTimezoneOffset,
} from "date-fns-tz";
import { useField } from "react-final-form";
import { format, startOfMinute } from "date-fns";

interface DateTimePickerI {
  value: Date;
  onChange: (date: Date | null) => void;
  label: string;
  timeZone: string;
}

const TimeDisplay = () => {
  const {
    input: { value: isSameTZ },
  } = useField("isSameTZ");
  const { input } = useField("starts_at");
  const {
    input: { value: tzValue },
  } = useField("time_zone");
  const starts_at = new Date(input.value);
  return (
    <div>
      <TimePickerInput
        {...input}
        label={`${tzValue?.timeZoneId}`}
        timeZone={tzValue?.timeZoneId}
      />
      {!isSameTZ && (
        <Box textAlign="right">
          <Typography variant="caption" color="GrayText">
            local:{" "}
          </Typography>
          <Typography variant="caption" color="HighlightText">
            {starts_at.getTime()
              ? format(starts_at, "M/d h:mm aa")
              : "invalid time"}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default TimeDisplay;

export const TimePickerInput: FC<DateTimePickerI> = ({
  value,
  onChange,
  label,
  timeZone,
}) => {
  const handleChange = (date: Date | null) => {
    const isValidTime = date && !!date?.getTime();
    if (isValidTime) {
      onChange(startOfMinute(zonedTimeToUtc(date, timeZone)));
    } else {
      onChange(date);
    }
  };
  const time = new Date(value);
  const invalidTime = !time.getTime(); // getTime() returns NaN if time is invalid
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={label}
        value={time.getTime() ? utcToZonedTime(time, timeZone) : ""}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            error={invalidTime}
            helperText={invalidTime && "invalid time"}
          />
        )}
      />
    </LocalizationProvider>
  );
};
