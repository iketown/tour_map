interface Address {
  street: string;
  city: string;
  prefecture: string;
  state: string;
  country: string;
}

interface ShortLong {
  short_name: string;
  long_name: string;
}
interface Place {
  place_id: string;
  name: string;
  url?: string;
  lat: number;
  lng: number;
  formatted_address: string;
  formatted_phone_number: string;
  website: string;
  streetNumObj: ShortLong;
  routeObj: ShortLong;
  cityObj: ShortLong;
  stateObj: ShortLong;
  countryObj: ShortLong;
  postCodeObj: ShortLong;
  timeZoneId: string; // "America/Chicago";
  // types?: string[];
  // photoUrls?: {
  //   height: number;
  //   width: number;
  //   html_attributions: string[];
  //   url: string;
  // }[];
}

interface Poi {
  lat: number;
  lng: number;
  type: string;
}

interface HotelPoi extends Poi {
  company: string;
  hotel_name: string;
}
interface AirportPoi extends Poi {
  type: "airport";
  name: string;
  city: string;
  country: string;
  iata_code: string;
  links_count: number;
  objectID: string;
  distanceKm?: number;
}
