// auth.tsx
import React, { useEffect } from "react";
import type { FC } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import type { User } from "firebase/auth";
import { getIdToken } from "firebase/auth";
import { clientAuth } from "~/utils/firebase/clientApp";
import {
  GoogleAuthProvider,
  EmailAuthProvider,
  // TwitterAuthProvider, GithubAuthProvider
} from "firebase/auth";
import Layout from "~/layout/Layout";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { useAuth } from "~/hooks/auth/useAuth";
import { setCookie } from "nookies";

const SignInScreen: FC = () => {
  const { push } = useRouter();
  const [user, loading, error] = useAuth();

  return (
    <Layout>
      <Typography component="p" sx={{ mt: 3 }}>
        Please sign-in:
      </Typography>
      <StyledFirebaseAuth
        uiConfig={{
          // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
          callbacks: {
            signInSuccessWithAuthResult: (user: User) => {
              console.log("signInSuccess: user", { user });

              push("/votes");
              return false; // should redirect?
            },
            signInFailure(authError) {},
          },
          signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID,
            // TwitterAuthProvider.PROVIDER_ID,
            // GithubAuthProvider.PROVIDER_ID,
          ],
        }}
        firebaseAuth={clientAuth}
      />
    </Layout>
  );
};

export default SignInScreen;
