import * as React from "react";
import {
  Button,
  Autocomplete,
  TextField,
  Box,
  SvgIcon,
  Chip,
} from "@mui/material";
import { poiTypes } from "~/xstate/poiTypes";
import type { POItype } from "~/xstate/poiTypes";

interface PoiSelectBoxI {
  onSelect: (poiNames: string[]) => void;
}

const PoiSelectBox: React.FC<PoiSelectBoxI> = ({ onSelect }) => {
  const [value, setValue] = React.useState<POItype[]>([poiTypes[0]]);
  const [inputValue, setInputValue] = React.useState("");

  const handleNewValue = (newValue: POItype[]) => {
    setValue(newValue);
    const poiNames = newValue.map((v) => v.name);
    onSelect && onSelect(poiNames);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Autocomplete
        fullWidth
        multiple
        value={value}
        onChange={(e, newValue, reason) => {
          handleNewValue(newValue);
        }}
        getOptionLabel={(opt) => opt.name}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={poiTypes}
        renderInput={(params) => {
          console.log("renderInput", params);
          const { InputProps, ...otherParams } = params;
          const { startAdornment, ...otherInputProps } = InputProps;
          const newStartAdornment = startAdornment?.map(({ props, key }) => {
            const poiType = poiTypes.find(({ name }) => name === props.label);
            const Icon = poiType?.icon;
            return (
              <Chip
                key={key}
                {...props}
                label={props.label.replaceAll("_", " ")}
                icon={Icon && <Icon style={{ fontSize: "1.5rem" }} />}
              />
            );
          });
          return (
            <TextField
              {...otherParams}
              InputProps={{
                startAdornment: newStartAdornment,
                ...otherInputProps,
              }}
              label="Find Nearby"
              fullWidth
            />
          );
        }}
        renderOption={(props, option: POItype) => {
          return (
            <Box component="li" {...props}>
              <Box sx={{ mr: 2 }}>
                <option.icon />
              </Box>
              {option.name.replace("_", " ")}
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default PoiSelectBox;
