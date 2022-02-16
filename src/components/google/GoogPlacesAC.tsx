import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import { useMapCtx } from "~/utils/googleMap/MapWrap";

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
  place_id: string;
}
const libraries: (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[] = ["places"];

interface GPACi {
  handleSelectedPlace: (place: google.maps.places.PlaceResult | null) => void;
  label: string;
  inputValue?: string;
  otherInputProps?: any;
  hasError?: boolean;
  errorMessage?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  types?: string[];
}

const GooglePlacesAutoComplete: React.FC<GPACi> = ({
  handleSelectedPlace,
  label,
  inputValue: defaultInputValue,
  otherInputProps,
  hasError,
  errorMessage,
  location,
  radius,
  types,
}) => {
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const { acService, placesService } = useMapCtx();

  useEffect(() => {
    console.log({ defaultInputValue });
    setInputValue(defaultInputValue);
  }, [defaultInputValue]);

  const fetch = useMemo(
    () =>
      throttle(
        (
          request: google.maps.places.AutocompletionRequest,
          callback: (results: readonly PlaceType[] | null) => void
        ) => {
          if (acService) {
            acService.getPlacePredictions(request, callback);
          } else {
            console.log("no ac service found");
          }
        },
        200
      ),
    [acService]
  );

  useEffect(() => {
    let active = true;

    if (!inputValue) {
      setOptions(value ? [value] : []);
      return;
    }

    fetch(
      {
        input: inputValue,
        location: location ? new google.maps.LatLng(location) : undefined,
        radius,
      },
      (results: readonly PlaceType[] | null) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch, location, radius]);

  return (
    <>
      <Autocomplete
        fullWidth
        id="google-map-demo"
        sx={{ width: 300 }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        onChange={(event: any, newValue: PlaceType | null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          if (newValue?.place_id) {
            if (!placesService) console.log("NO places service", placesService);
            placesService?.getDetails(
              { placeId: newValue.place_id },
              handleSelectedPlace
            );
          }
          setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...otherInputProps}
            {...params}
            label={label}
            fullWidth
            error={hasError}
            helperText={errorMessage}
          />
        )}
        renderOption={(props, option) => {
          const matches =
            option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match: any) => [
              match.offset,
              match.offset + match.length,
            ])
          );

          return (
            <li {...props}>
              <Grid container alignItems="center">
                <Grid item>
                  <Box
                    component={LocationOnIcon}
                    sx={{ color: "text.secondary", mr: 2 }}
                  />
                </Grid>
                <Grid item xs>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                  <Typography variant="body2" color="text.secondary">
                    {option.structured_formatting.secondary_text}
                  </Typography>
                </Grid>
              </Grid>
            </li>
          );
        }}
      />
    </>
  );
};

export default GooglePlacesAutoComplete;
