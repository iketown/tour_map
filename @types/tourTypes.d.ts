interface Tour {
  tour_id: string;
  created_by: string;
  updated_at: number;
  admins: {
    [admin_id: string]: {
      roles: string[];
    };
  };
  event_ids: string[];
}
