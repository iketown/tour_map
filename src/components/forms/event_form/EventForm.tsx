import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from "@mui/material";
import arrayMutators from "final-form-arrays";
import { Field, Form } from "react-final-form";
import { useEventFxns } from "~/hooks/formHooks/useEventFxns";
import GoogPlacesApi from "../google/GoogPlacesAPI";
import { DatePickerInput } from "./DatePicker";
import { eventFormValidator } from "./eventFormValidator";
import EventTimesArray from "./EventTimesArray";
import EventTimesReorderer from "./EventTimesReorderer";
import FakeInfoButtons from "./FakeInfoButtons";
import PlaceIdHandler from "./PlaceIdHandler";
import TimeDisplay from "./TimeDisplay";
import TZHandler from "./TZHandler";

const initialValues: Partial<EventRecord> = {
  starts_at: new Date(),
  place_id: "",
  event_id: "",
};

interface EventFormI {
  event?: EventRecord;
}
const EventForm: React.FC<EventFormI> = ({ event }) => {
  const { updateEvent } = useEventFxns();

  const handleSubmit = async (values: EventRecord) => {
    if (!values?.place || !values?.time_zone)
      return { place: "location must be selected" };
    values.place = { ...values.place, timeZoneId: values.time_zone.timeZoneId };
    console.log("form values", values);
    const event_id = await updateEvent(values);
    console.log("saved", { event_id });
  };

  return (
    <Card sx={{ maxWidth: "md", mx: "auto" }}>
      <CardHeader title="New Event" />
      <CardContent>
        <Form
          onSubmit={handleSubmit}
          initialValues={event || initialValues}
          validate={eventFormValidator}
          mutators={{ ...arrayMutators }}
        >
          {({ handleSubmit, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <FakeInfoButtons />
                  <Grid item xs={12} sm={6}>
                    <Field name="place">
                      {({ input, meta }) => {
                        const { value, onChange, ...otherInput } = input;
                        return (
                          <GoogPlacesApi
                            label="Location"
                            value={value}
                            onChange={onChange}
                            otherInput={otherInput}
                            hasError={
                              meta.touched &&
                              (!!meta.error || !!meta.submitError)
                            }
                            errorMessage={
                              meta.touched && (meta.error || meta.submitError)
                            }
                          />
                        );
                      }}
                    </Field>
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
                  <Grid item xs={12} sm={6}></Grid>
                  <Grid item xs={12}>
                    <Button size="large" variant="contained" type="submit">
                      Save
                    </Button>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <pre style={{ fontSize: 10 }}>
                      {JSON.stringify(values, null, 2)}
                    </pre>
                  </Grid> */}
                </Grid>
              </form>
            );
          }}
        </Form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
