import type { User } from "firebase/auth";
import { onIdTokenChanged, getAuth, getIdToken } from "firebase/auth";
import { app } from "~/utils/firebase/clientApp";
import { clientAuth } from "~/utils/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

import { setCookie } from "nookies";

import { createContext, useContext, useEffect, useState } from "react";
import type { FC } from "react";

interface AuthCtxI {
  user?: User | null;
  user_id?: string;
  loading: boolean;
  error?: Error;
}
const AuthCtx = createContext<AuthCtxI>({
  user: null,
  loading: true,
});

export const AuthCtxProvider: FC = ({ children }) => {
  const [user, loading, error] = useAuthState(clientAuth);
  const user_id = user?.uid;

  useEffect(() => {
    // set token cookie for signed in user
    const unsub = onIdTokenChanged(getAuth(app), async (user) => {
      console.log("id token changed", new Date().toTimeString(), user);
      if (user) {
        console.log("user", user);
        const token = await getIdToken(user);
        setCookie(null, "token", token);
      } else {
        console.log("no user, loser");
        setCookie(null, "token", "");
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    // force refresh the token every 10 minutes
    const interval = setInterval(async () => {
      const _user = getAuth(app).currentUser;
      if (_user) await _user.getIdToken(true);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, user_id, loading, error }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuthCtx = () => useContext(AuthCtx);
