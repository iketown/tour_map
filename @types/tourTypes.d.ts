interface Tour {
  tour_id: string;
  slug: string;
  created_by: string;
  updated_at: number;
  admins: {
    [admin_id: string]: {
      roles: string[];
    };
  };
  events_basic: {
    [event_id: string]: EventBasic;
  };
  title: string;
  public_cal_id?: string;
  private_cal_id?: string;
}

interface Leg {
  start_time: number;
  end_time: number;
  title: string;
}

interface EventBasic {
  // to plot dates on a map with minimal info
  loc: {
    lat: number;
    lng: number;
  };
  date: number; // Date.valueOf();
  event_id: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  tz: string;
  first_of_leg: boolean;
  goog_cal_id?: string;
}
