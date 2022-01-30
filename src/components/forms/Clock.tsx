import React from "react";
import ReactClock from "react-clock";
import { toDate, utcToZonedTime, formatInTimeZone } from "date-fns-tz";
import { styled } from "@mui/material/styles";

const ClockDiv = styled("div")({
  ".react-clock__minute-hand__body": {
    backgroundColor: "#00000055",
    zIndex: 0,
  },
});
interface ClockI {
  time: Date | null;
  timeZone: string;
}
const Clock: React.FC<ClockI> = ({ time, timeZone }) => {
  if (!time) return <div />;
  const zonedDate = utcToZonedTime(time, timeZone);
  return (
    <ClockDiv>
      <ReactClock
        value={zonedDate}
        size={30}
        renderMinuteMarks={false}
        renderHourMarks={false}
        renderSecondHand={false}
        hourHandWidth={2}
        minuteHandLength={80}
      />
    </ClockDiv>
  );
};

export default Clock;
