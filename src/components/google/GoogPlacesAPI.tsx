import { CircularProgress, TextField } from "@mui/material";
import {
  Autocomplete,
  LoadScriptNext,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import type { FC } from "react";

interface GoogACI {
  value: Place;
  otherInput: any;
  onChange: (place: any) => void;
  hasError?: boolean;
  errorMessage?: string;
  label?: string;
}

const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

const formatInput = (place: Partial<Place>) => {
  if (!place) return "";
  return `${place.name}, ${place.formatted_address}`;
};

const GoogACApi: FC<GoogACI> = ({
  value,
  onChange,
  hasError,
  errorMessage,
  otherInput,
  label,
}) => {
  const [ac, setAc] = useState<google.maps.places.Autocomplete>();
  const [inputValue, setInputValue] = useState(formatInput(value));
  useEffect(() => {
    setInputValue(formatInput(value));
  }, [value]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY!,
    libraries,
  });

  const handlePlaceChanged = useCallback(async () => {
    if (!ac) return;
    const place = ac.getPlace();
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
    onChange(newPlace);
    setInputValue(formatInput(newPlace));
    // console.log(place, { lat, lng });
  }, [ac]);

  return isLoaded ? (
    <Autocomplete onLoad={setAc} onPlaceChanged={handlePlaceChanged}>
      <TextField
        label={label}
        error={hasError}
        helperText={hasError && errorMessage}
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        // defaultValue={
        //   value.name ? `${value.name}, ${value.formatted_address}` : ""
        // }
        {...otherInput}
      />
    </Autocomplete>
  ) : (
    <TextField fullWidth placeholder="Google Places not loaded" />
  );
};

export default GoogACApi;
