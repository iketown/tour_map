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

interface Hotel extends Place {
  company: string;
  hotel_name: string;
}
