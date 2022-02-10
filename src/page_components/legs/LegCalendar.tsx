import React from "react";
import { styled } from "@mui/material/styles";
import ReactCalendar from "react-calendar";
import { blue, orange, yellow, blueGrey } from "@mui/material/colors";
import { format } from "date-fns";
import classnames from "classnames";
const StyledCalendar = styled(ReactCalendar)`
  .gig_day {
    position: relative;
  }
  .gig_day:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background-color: ${blue[200]};
    opacity: 0.4;
    border-radius: 100%;
    padding: 10px;
  }
  .in_range {
    background-color: ${yellow[200]};
  }
  .react-calendar__tile--active {
    background: ${blueGrey[600]};
  }
`;

interface LegCalendarI {
  value: Date;
  gigThisDay: (date: Date) => EventBasic | undefined;
  inRange: (date: Date) => boolean;
  onClickDay: (date: Date) => void;
  tileDisabled?: (date: Date) => boolean;
}

const LegCalendar: React.FC<LegCalendarI> = ({
  value,
  gigThisDay,
  inRange,
  onClickDay,
  tileDisabled,
}) => {
  return (
    <StyledCalendar
      value={value}
      //   onChange={(dates) => {
      //     console.log("dates", dates);
      //   }}
      tileDisabled={({ date }) => (tileDisabled ? tileDisabled(date) : false)}
      onClickDay={onClickDay}
      activeStartDate={value}
      tileClassName={({ date, view }) => {
        const thisDay = gigThisDay(date);
        const isInRange = inRange(date);
        return classnames({
          gig_day: !!thisDay,
          in_range: isInRange,
        });
      }}
      //   formatDay={() => ""}
      //   tileContent={({ date }) => {
      //     const thisDay = gigThisDay(date);
      //     console.log(date, thisDay);
      //     return (
      //       <div style={{ fontWeight: !!thisDay ? "bold" : "inherit" }}>
      //         {format(date, "d")}
      //       </div>
      //     );
      //   }}
    />
  );
};

export default LegCalendar;
