import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Form, Field } from "react-final-form";
import NextLink from "next/link";
import Copyright from "~/components/Copyright";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { useRouter } from "next/router";
import { createUser } from "~/utils/firebase/authFxns";
import Layout from "~/layout/Layout";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function SignUp() {
  const { push } = useRouter();
  const handleSubmit = async (values: FormValues) => {
    const { email, password, firstName, lastName } = values;
    try {
      const response = await createUser({ email, password });
      console.log({ response });
    } catch (error) {
      //@ts-ignore
      switch (error.code) {
        case "auth/email-already-in-use":
          return {
            email: (
              <span>
                email already in use. did you mean to{" "}
                <NextLink href="/auth/signin">
                  <Link sx={{ cursor: "pointer" }}>SIGN IN</Link>
                </NextLink>
                ?
              </span>
            ),
          };
        case "auth/weak-password": {
          return {
            password: "please try a stronger password",
          };
        }
      }
    }
  };

  return (
    <Layout>
      <Form onSubmit={handleSubmit}>
        {({ handleSubmit, submitErrors, hasSubmitErrors }) => {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />

              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field name="firstName">
                        {({ input, meta }) => {
                          return (
                            <TextField
                              autoComplete="given-name"
                              required
                              fullWidth
                              id="firstName"
                              label="First Name"
                              autoFocus
                              {...input}
                            />
                          );
                        }}
                      </Field>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field name="lastName">
                        {({ input }) => (
                          <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            autoComplete="family-name"
                            {...input}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="email">
                        {({ input, meta }) => (
                          <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            error={
                              meta.touched && (meta.error || meta.submitError)
                            }
                            helperText={
                              (meta.error || meta.submitError) &&
                              meta.touched &&
                              (meta.error || meta.submitError)
                            }
                            {...input}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="password">
                        {({ input, meta }) => (
                          <TextField
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            error={
                              meta.touched && (meta.error || meta.submitError)
                            }
                            helperText={
                              (meta.error || meta.submitError) &&
                              meta.touched &&
                              (meta.error || meta.submitError)
                            }
                            {...input}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <NextLink href="/auth/signin">
                        <div>
                          Already have an account?{" "}
                          <Link sx={{ cursor: "pointer" }}>Sign in</Link>
                        </div>
                      </NextLink>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 5 }} />
            </Container>
          );
        }}
      </Form>
    </Layout>
  );
}
