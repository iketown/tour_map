import React, { useState } from "react";
import GPAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";

const initialValue = {
  label: "116 Barlow Drive, Franklin, TN, USA",
  value: {
    description: "116 Barlow Drive, Franklin, TN, USA",
    matched_substrings: [
      {
        length: 3,
        offset: 0,
      },
      {
        length: 3,
        offset: 4,
      },
    ],
    place_id: "ChIJnx8vpKuAY4gRmaDSG9__PT8",
    reference: "ChIJnx8vpKuAY4gRmaDSG9__PT8",
    structured_formatting: {
      main_text: "116 Barlow Drive",
      main_text_matched_substrings: [
        {
          length: 3,
          offset: 0,
        },
        {
          length: 3,
          offset: 4,
        },
      ],
      secondary_text: "Franklin, TN, USA",
    },
    terms: [
      {
        offset: 0,
        value: "116",
      },
      {
        offset: 4,
        value: "Barlow Drive",
      },
      {
        offset: 18,
        value: "Franklin",
      },
      {
        offset: 28,
        value: "TN",
      },
      {
        offset: 32,
        value: "USA",
      },
    ],
    types: ["street_address", "geocode"],
  },
};

const GooglePlacesAC = () => {
  const [value, setValue] = useState(initialValue);
  const handleGeocode = () => {
    if (!value) return;
    const place_id = value?.value?.place_id;
    console.log({ place_id });
  };
  return (
    <div>
      <h3>autocomplete</h3>
      <GPAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}
        selectProps={{ value, onChange: setValue }}
      />

      <pre style={{ fontSize: 10 }}>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

export default GooglePlacesAC;
