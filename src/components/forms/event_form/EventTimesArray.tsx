import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { add, isBefore } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import React, { useEffect, useState } from "react";
import { useField, useForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import Clock from "./Clock";
import { TimePickerInput } from "./TimeDisplay";

const EventTimesArray = () => {
  const {
    mutators: { push, pop },
  } = useForm();
  const {
    input: { value: starts_at },
  } = useField<Date>("starts_at");
  const {
    input: { value: time_zone },
  } = useField("time_zone");

  if (!time_zone) {
    console.error("time zone is required to render EventTimesArray");
    return <div style={{ color: "red" }}>please select location.</div>;
  }
  return (
    <div>
      <FieldArray name="times">
        {({ fields }) => {
          return (
            <List>
              {fields.length ? <ListSubheader>schedule</ListSubheader> : null}
              {fields.map((fieldName, index) => {
                const handleRemove = () => {
                  fields.remove(index);
                };
                return (
                  <TimeListItem
                    key={fieldName}
                    {...{ fieldName, index, handleRemove }}
                  />
                );
              })}
              <ListItemButton
                onClick={() => push("times", { title: "", time: starts_at })}
              >
                Add Schedule Item
              </ListItemButton>
            </List>
          );
        }}
      </FieldArray>
    </div>
  );
};

export default EventTimesArray;

interface TimeListItemI {
  fieldName: string;
  index: number;
  handleRemove: () => void;
}
const TimeListItem: React.FC<TimeListItemI> = ({
  fieldName,
  index,
  handleRemove,
}) => {
  const {
    input: { value: time_zone },
  } = useField("time_zone");

  const { input, meta } = useField(fieldName);

  const startTimeD = input.value?.time && new Date(input.value.time);
  const endTimeD = input.value?.endTime && new Date(input.value.endTime);
  const itemStartTime = startTimeD?.getTime() ? startTimeD : null;
  const itemEndTime = endTimeD?.getTime() ? endTimeD : null;

  const tz_id = time_zone?.timeZoneId;

  const defaultTime = new Date();

  const [editing, setEditing] = useState(!input.value?.title);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState<Date | null>(
    input.value?.time || defaultTime
  );
  const [useEndTime, setUseEndTime] = useState(!!itemEndTime);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const handleSave = () => {
    if (useEndTime && endTime) {
      input.onChange({ title, time, endTime });
    } else {
      input.onChange({ title, time });
    }
    setEditing(false);
  };
  const handleCancel = () => {
    setTitle(input.value.title || "");
    setTime(input.value.time || defaultTime);
    setEditing(false);
  };

  useEffect(() => {
    const _time = input.value?.time;
    const _title = input.value?.title || "";
    const _endTime = input.value?.endTime;
    setTitle(_title);
    if (_time) setTime(_time);
    if (_endTime) {
      setEndTime(_endTime);
      setUseEndTime(true);
    } else {
      setEndTime(null);
      setUseEndTime(false);
    }
  }, [input.value]);

  const editView = (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={10} container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="title"
            placeholder="Load in, etc"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <TimePickerInput
              label="start time"
              timeZone={tz_id}
              value={time || defaultTime}
              onChange={(time) => {
                setTime(time);
                if (
                  time?.getTime() &&
                  endTime?.getTime() &&
                  isBefore(endTime, time)
                ) {
                  setEndTime(time);
                }
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box width={"100%"} display="flex" alignItems={"center"}>
            {time && (
              <Checkbox
                checked={useEndTime}
                onChange={(e, chk) => {
                  setUseEndTime(chk);
                  setEndTime(add(time, { hours: 1 }));
                }}
              />
            )}
            {useEndTime ? (
              <Box>
                <TimePickerInput
                  label="end time"
                  timeZone={tz_id}
                  value={endTime || defaultTime}
                  onChange={setEndTime}
                />
              </Box>
            ) : (
              <Typography variant="caption" color="GrayText">
                add end time
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={2}
        alignItems={"center"}
        justifyContent={"center"}
        display="flex"
      >
        <Stack spacing={1}>
          <Button
            startIcon={<Save />}
            color="success"
            size="small"
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
          <Button
            startIcon={<Cancel />}
            color="warning"
            size="small"
            onClick={handleCancel}
            variant="outlined"
          >
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );

  const nonEditView = (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
      divider={<Divider orientation="vertical" flexItem />}
      spacing={1}
    >
      <Clock time={itemStartTime} timeZone={tz_id} />
      <>
        <Typography variant="body2" color="GrayText">
          {itemStartTime && formatInTimeZone(itemStartTime, tz_id, "h:mm aaa")}
        </Typography>
        {itemEndTime && (
          <>
            <Typography variant="caption" color="GrayText">
              -
            </Typography>
            <Typography variant="body2" color="GrayText">
              {itemEndTime && formatInTimeZone(itemEndTime, tz_id, "h:mm aaa")}
            </Typography>
          </>
        )}
      </>
      <Typography
        variant="subtitle1"
        sx={{ flexGrow: 1 }}
        color="HighlightText"
      >
        {input.value?.title}
      </Typography>
      <IconButton
        size="small"
        color="primary"
        onClick={() => {
          setEditing(true);
        }}
      >
        <Edit />
      </IconButton>
      <IconButton size="small" color="warning" onClick={handleRemove}>
        <Delete />
      </IconButton>
    </Stack>
  );
  return <ListItem divider>{editing ? editView : nonEditView}</ListItem>;
};

// {({ fields }) =>
//         <List>
//           { fields.map((name, index) => (
//             <div key={name}>
//               <label>Cust. #{index + 1}</label>
//               <Field
//                 name={`${name}.firstName`}
//                 component="input"
//                 placeholder="First Name"
//                 />
//               <Field
//                 name={`${name}.lastName`}
//                 component="input"
//                 placeholder="Last Name"
//                 />
//               <span
//                 onClick={() => fields.remove(index)}
//                 style={{ cursor: "pointer" }}
//                 >
//                 ❌
//               </span>
//             </div>}
//           )) }
//           </List>
