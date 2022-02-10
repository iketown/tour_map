interface CalEvent {
  id: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  location: string; // address
  creator: {
    email: string;
  };
  organizer: {
    email: string; // @group.calendar.google.com
    displayName: string;
    self: boolean;
  };
  start: {
    date: string;
  };
  end: {
    date: string;
  };
  iCalUID: string;
  eventType: string;
  extendedProperties?: {
    private?: {
      tour_event_id: string;
    };
  };
}
