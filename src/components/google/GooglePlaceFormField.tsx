import React, { useState } from "react";
import { googlePlaceParse } from "./googlePlaceParse";
import GoogPlacesAC from "./GoogPlacesAC";
import { useField } from "react-final-form";
import { Box, Button, Typography } from "@mui/material";

//
//
interface GPFFi {
  locString?: string;
}

const GooglePlaceFormField: React.FC<GPFFi> = ({ locString }) => {
  const { input, meta } = useField<Place>("place");
  const {
    input: { value: event_id },
  } = useField("event_id");
  const [editing, setEditing] = useState(!event_id);
  const { value, onChange, ...otherInputProps } = input;
  const handleSelectedPlace = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (!place) return;
    const parsedPlace = googlePlaceParse(place);
    input.onChange(parsedPlace);
    setEditing(false);
    console.log("place", place);
  };

  const placeName = input.value?.name;
  const placeAddy = input.value?.formatted_address;
  const textValue = `${placeName || ""}, ${placeAddy || ""}`;

  return editing ? (
    <Box
      sx={{
        border: "1px solid gainsboro",
        borderRadius: "1rem",
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <GoogPlacesAC
        {...{ handleSelectedPlace }}
        label="Location"
        inputValue={locString || textValue}
        otherInputProps={otherInputProps}
        hasError={!!meta.touched && (!!meta.error || !!meta.submitError)}
        errorMessage={meta.touched && (meta.error || meta.submitError)}
      />
      <Button
        onClick={() => {
          setEditing(false);
        }}
      >
        cancel
      </Button>
    </Box>
  ) : (
    <Box
      sx={{
        border: "1px solid gainsboro",
        borderRadius: "1rem",
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography fontWeight={"bold"} variant="subtitle1">
          {placeName}
        </Typography>
        <Typography variant="caption" color="GrayText">
          {placeAddy}
        </Typography>
      </Box>
      <Box>
        <Button variant="outlined" onClick={() => setEditing(true)}>
          change
        </Button>
      </Box>
    </Box>
  );
};

export default GooglePlaceFormField;
