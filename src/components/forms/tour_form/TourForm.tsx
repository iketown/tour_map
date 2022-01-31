import {
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { Form, Field } from "react-final-form";
import { useTourFxns } from "~/hooks/formHooks/useTourFxns";
import { useToast } from "~/hooks/useToast";
import FormValueView from "~/utils/formHelp/FormValueView";

const TourForm = () => {
  const { updateTour } = useTourFxns();
  const { push } = useRouter();
  const { toast } = useToast();
  const onSubmit = async (values: any) => {
    console.log("tour form values", values);
    const tour_id = await updateTour(values);
    if (tour_id) {
      toast("tour created", "success");
      push("/admin/tours/[tour_id]", `/admin/tours/${tour_id}`);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, values }) => {
        return (
          <Card>
            <CardContent>
              <FormValueView />
              <Grid container>
                <Grid item xs={12}>
                  <Field name="title">
                    {({ input, meta }) => {
                      return (
                        <TextField
                          {...input}
                          fullWidth
                          label="Title"
                          error={
                            meta.touched && (meta.error || meta.submitError)
                          }
                          helperText={
                            meta.touched && (meta.error || meta.submitError)
                          }
                        />
                      );
                    }}
                  </Field>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                color="info"
                size="large"
                onClick={handleSubmit}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
              >
                SAVE
              </Button>
            </CardActions>
          </Card>
        );
      }}
    </Form>
  );
};

export default TourForm;
