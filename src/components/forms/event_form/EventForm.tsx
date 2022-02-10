import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import arrayMutators from "final-form-arrays";
import { Field, Form } from "react-final-form";
import DataView from "~/components/DataView";
import GooglePlaceFormField from "~/components/google/GooglePlaceFormField";
import { useEventFxns } from "~/hooks/formHooks/useEventFxns";
import { useToast } from "~/hooks/useToast";
import { DatePickerInput } from "./DatePicker";
import EventAutoTitle from "./EventAutoTitle";
import { eventFormValidator } from "./eventFormValidator";
import EventTimesArray from "./EventTimesArray";
import EventTimesReorderer from "./EventTimesReorderer";
import PlaceIdHandler from "./PlaceIdHandler";
import TimeDisplay from "./TimeDisplay";
import TZHandler from "./TZHandler";

const initialValues: Partial<EventRecord> = {
  place_id: "",
  event_id: "",
};

interface EventFormI {
  event?: Partial<EventRecord> | null;
  defaultDate?: Date;
  closeForm?: () => void;
}
const EventForm: React.FC<EventFormI> = ({ event, defaultDate, closeForm }) => {
  const { updateEvent, deleteEvent } = useEventFxns();
  const { toast } = useToast();

  const handleSubmit = async (values: EventRecord) => {
    if (!values?.place || !values?.time_zone)
      return { place: "location must be selected" };
    values.place = { ...values.place, timeZoneId: values.time_zone.timeZoneId };
    const event_id = await updateEvent(values);
    toast("event updated", "success");
    closeForm && closeForm();
  };

  const handleDelete = (event_id: string) => {
    deleteEvent(event_id);
    closeForm && closeForm();
  };

  return (
    <Card sx={{ maxWidth: "md", mx: "auto" }}>
      <Form
        onSubmit={handleSubmit}
        initialValues={
          event || { ...initialValues, starts_at: defaultDate || new Date() }
        }
        validate={eventFormValidator}
        mutators={{ ...arrayMutators }}
      >
        {({ handleSubmit, values, pristine }) => {
          return (
            <form onSubmit={handleSubmit}>
              <EventAutoTitle />

              <CardContent>
                <Grid container spacing={2}>
                  {/* <FakeInfoButtons /> */}
                  <Grid item xs={12} sm={6}>
                    <GooglePlaceFormField />
                    <PlaceIdHandler />
                    <TZHandler />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                      <Field name="starts_at">
                        {({ input, meta }) => {
                          return (
                            <DatePickerInput
                              {...input}
                              label="Date"
                              timeZone={values?.time_zone?.timeZoneId}
                            />
                          );
                        }}
                      </Field>
                      <div>{values?.time_zone && <TimeDisplay />}</div>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    {values?.time_zone && <EventTimesArray />}
                    <EventTimesReorderer />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field name="goog_cal_id">
                      {({ input, meta }) => {
                        return input.value ? (
                          <Typography variant="caption">
                            google event id: {input.value}
                          </Typography>
                        ) : (
                          <div>no goog event</div>
                        );
                      }}
                    </Field>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Field name="first_of_leg">
                  {({ input }) => {
                    return (
                      <Button
                        onClick={() => {
                          input.onChange(!input.value);
                        }}
                        variant={input.value ? "contained" : "outlined"}
                      >
                        Start of Leg
                      </Button>
                    );
                  }}
                </Field>
                <DataView data={values} title="values" />
                {values.event_id && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      handleDelete(values.event_id);
                    }}
                  >
                    DELETE event
                  </Button>
                )}
                <Button
                  disabled={pristine}
                  size="large"
                  variant="contained"
                  type="submit"
                >
                  Save
                </Button>
              </CardActions>
            </form>
          );
        }}
      </Form>
    </Card>
  );
};

export default EventForm;
