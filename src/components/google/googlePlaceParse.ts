export const googlePlaceParse = (place: google.maps.places.PlaceResult) => {
  const {
    place_id = "",
    formatted_address = "",
    formatted_phone_number = "",
    website = "",
    address_components,
    name = "no name",
    url,
    geometry,
  } = place;
  const lat = geometry?.location?.lat() || 0;
  const lng = geometry?.location?.lng() || 0;

  const getShortLong = ({
    short_name,
    long_name,
  }: {
    short_name: string;
    long_name: string;
  }) => ({ short_name, long_name });
  const emptyObj = { short_name: "", long_name: "" };
  const streetNumObj =
    address_components
      ?.filter((c) => c.types.includes("street_number"))
      ?.map(getShortLong)[0] || emptyObj;
  const routeObj =
    address_components
      ?.filter((c) => c.types.includes("route"))
      ?.map(getShortLong)[0] || emptyObj;
  const cityObj =
    address_components
      ?.filter((c) => c.types.includes("locality"))
      ?.map(getShortLong)[0] || emptyObj;
  const stateObj =
    address_components
      ?.filter((c) => c.types.includes("administrative_area_level_1"))
      ?.map(getShortLong)[0] || emptyObj;
  const countryObj =
    address_components
      ?.filter((c) => c.types.includes("country"))
      ?.map(getShortLong)[0] || emptyObj;
  const postCodeObj =
    address_components
      ?.filter((c) => c.types.includes("postal_code"))
      ?.map(getShortLong)[0] || emptyObj;

  const newPlace: Partial<Place> = {
    url,
    lat,
    lng,
    place_id,
    name,
    formatted_address,
    formatted_phone_number,
    website,
    streetNumObj,
    routeObj,
    cityObj,
    stateObj,
    countryObj,
    postCodeObj,
    // photoUrls,
    // types,
  };
  return newPlace;
};
