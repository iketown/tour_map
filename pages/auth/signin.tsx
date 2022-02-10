import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useEffect } from "react";
import { Field, Form } from "react-final-form";
import Copyright from "~/components/Copyright";
import { useAuthCtx } from "~/contexts/AuthCtx";
import { useToast } from "~/hooks/useToast";
import { signInUser, createUser } from "~/utils/firebase/authFxns";
import Layout from "~/layout/Layout";
import nookies, { setCookie, parseCookies } from "nookies";
import { useRouter } from "next/router";

interface FormValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const { toast } = useToast();
  const { user, user_id, pathAfterAuth } = useAuthCtx();
  const { push } = useRouter();

  const nookieTest = () => {
    const foo = "bar";
    nookies.set(null, "foo", "nookyfoo");
    const cookies = nookies.get();
    nookies.set(null, "foo", "secondFoo");
    const cookies2 = nookies.get();
    console.log({ foo, cookies, cookies2 });
  };

  useEffect(() => {
    console.log("use fff", user, pathAfterAuth);
    if (user && pathAfterAuth) {
      push(pathAfterAuth);
    }
  }, [user]);
  const onSubmit = async (values: FormValues) => {
    const { email, password } = values;
    try {
      const signInResponse = await signInUser({ email, password });
    } catch (error) {
      //@ts-ignore
      switch (error?.code) {
        case "auth/wrong-password": {
          return { password: "wrong password" };
        }
        case "auth/user-not-found": {
          return {
            email: (
              <span>
                user not found. did you already{" "}
                <NextLink href="/auth/signup">
                  <Link sx={{ cursor: "pointer" }}>SIGN UP</Link>
                </NextLink>{" "}
                ?
              </span>
            ),
          };
        }
      }
      console.log("sign in error", error);
    }
  };
  return (
    <Layout>
      <Button onClick={nookieTest}>nookytest</Button>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => {
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
                  Sign in
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Field name="email">
                    {({ input, meta }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        error={meta.touched && (meta.error || meta.submitError)}
                        helperText={
                          (meta.error || meta.submitError) &&
                          meta.touched &&
                          (meta.error || meta.submitError)
                        }
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="password">
                    {({ input, meta }) => (
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        error={meta.touched && (meta.error || meta.submitError)}
                        helperText={
                          (meta.error || meta.submitError) &&
                          meta.touched &&
                          (meta.error || meta.submitError)
                        }
                        {...input}
                      />
                    )}
                  </Field>
                  <Field name="remember">
                    {({ input }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={!!input.value}
                            onChange={(e, chk) => input.onChange(chk)}
                          />
                        }
                        label="Remember me"
                      />
                    )}
                  </Field>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link
                        onClick={() => toast("tuff crap mofo", "error")}
                        href="#"
                        variant="body2"
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <NextLink href="/auth/signup">
                        <div>
                          Don't have an account?{" "}
                          <Link sx={{ cursor: "pointer" }}>Sign Up</Link>
                        </div>
                      </NextLink>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
          );
        }}
      </Form>
    </Layout>
  );
}
