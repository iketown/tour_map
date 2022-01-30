interface EventRecord {
  event_id: string;
  place_id: string;
  starts_at: Date;
  times: {
    title: string; // "Load in" or "Dinner"
    time: Date | string | number;
    endTime?: Date | string | number;
  }[];
  time_zone?: TimeZone;
  place?: Place;
}

interface TimeZone {
  dstOffset: number; // 3600;
  rawOffset: number; // -21600;
  timeZoneId: string; // "America/Chicago";
  timeZoneName: string; // "Central Daylight Time";
}
