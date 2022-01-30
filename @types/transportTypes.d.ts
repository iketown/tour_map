interface Transport {
  from_lat: number;
  to_lat: number;
  from_lng: number;
  to_lng: number;
  distance: number;
  distance_units: "m" | "km";
  departure_time: number;
  arrival_time: number;
  duration_sec: number;
  from_address: Address;
  to_address: Address;
  type: string;
}

interface CommercialFlight extends Transport {
  booking_company?: string;
  carrier_company: string;
  flight_number: string;
  from_airport: string;
  to_airport: string;
  type: "commercial_flight";
}

interface PrivateFlight extends CommercialFlight {
  type: "private_flight";
}

interface GroundTransport extends Transport {
  type: "taxi" | "uber" | "lyft" | "hotel_shuttle" | "bus";
}

interface Train extends Transport {
  company: string;
}
