import { useField } from "react-final-form";

import { useEffect } from "react";

const PlaceIdHandler = () => {
  const { input } = useField("place_id");
  const {
    input: { value: placeValue },
  } = useField("place");

  useEffect(() => {
    const place_id = placeValue?.place_id;
    if (place_id) {
      input.onChange(place_id);
    }
  }, [placeValue]);
  return null;
};

export default PlaceIdHandler;
