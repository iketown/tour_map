interface EventRecord {
  event_id: string;
  goog_cal_id?: string;
  title: string;
  tour_id: string;
  place_id: string;
  starts_at: Date;
  first_of_leg: boolean;
  times: {
    title: string; // "Load in" or "Dinner"
    time: Date | string | number;
    endTime?: Date | string | number;
  }[];
  time_zone?: TimeZone;
  place?: Place;
  first_of_leg?: boolean;
}

interface TimeZone {
  dstOffset: number; // 3600;
  rawOffset: number; // -21600;
  timeZoneId: string; // "America/Chicago";
  timeZoneName: string; // "Central Daylight Time";
}
