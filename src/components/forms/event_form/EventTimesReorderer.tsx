import React, { useEffect } from "react";
import { useField } from "react-final-form";
import { isBefore } from "date-fns";
import { isEqual } from "lodash";

const EventTimesReorderer = () => {
  const { input, meta } = useField("times");
  const schedEvents = input.value;

  useEffect(() => {
    if (!schedEvents) return;
    const ordered = [...schedEvents].sort((a, b) => {
      const aTime = new Date(a.time);
      const bTime = new Date(b.time);
      return isBefore(aTime, bTime) ? -1 : 1;
    });
    if (!isEqual(schedEvents, ordered)) {
      input.onChange(ordered);
    }
  }, [JSON.stringify(schedEvents)]);
  return null;
};

export default EventTimesReorderer;
