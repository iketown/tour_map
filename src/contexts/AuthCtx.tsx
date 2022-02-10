import type { User } from "firebase/auth";
import { onIdTokenChanged, getAuth, getIdToken } from "firebase/auth";
import { clientAuth } from "~/utils/firebase/clientApp";

import { useAuthState } from "react-firebase-hooks/auth";

import nookies, { setCookie } from "nookies";

import { createContext, useContext, useEffect, useState } from "react";
import type { FC, Dispatch, SetStateAction } from "react";
import { format } from "date-fns";

interface AuthCtxI {
  user?: User | null;
  user_id?: string;
  pathAfterAuth: string;
  setPathAfterAuth: Dispatch<SetStateAction<string>>;
  loading: boolean;
  error?: Error;
}
const errorFxn = () => {
  throw new Error("out of Auth Ctx");
};
const AuthCtx = createContext<AuthCtxI>({
  user: null,
  loading: true,
  setPathAfterAuth: errorFxn,
  pathAfterAuth: "",
});

export const AuthCtxProvider: FC = ({ children }) => {
  const [user, loading, error] = useAuthState(clientAuth);
  const [pathAfterAuth, setPathAfterAuth] = useState("/admin/tours");
  const user_id = user?.uid;

  useEffect(() => {
    return onIdTokenChanged(clientAuth, async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        console.log("token changed", token.slice(-10));
      } else {
        console.log("user signed out");
        nookies.set(null, "token", "");
      }
    });
  }, []);

  useEffect(() => {
    const handleUserToken = () => {
      const _user = clientAuth.currentUser;
      if (_user) {
        _user.getIdTokenResult(true).then((result) => {
          const { token, expirationTime } = result;
          console.log(
            "updating token",
            token.slice(-10),
            `time now: ${format(new Date(), "hh:mm:ss")}`,
            `expires ${format(new Date(expirationTime), "hh:mm:ss")}`
          );
          nookies.destroy(null, "token");
          nookies.set(null, "token", token);
        });
      } else {
        nookies.destroy(null, "token");
      }
    };
    // new token on first load.
    handleUserToken();
    // reset every x minutes
    const interval = setInterval(handleUserToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [clientAuth.currentUser]);

  return (
    <AuthCtx.Provider
      value={{ user, user_id, loading, error, pathAfterAuth, setPathAfterAuth }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuthCtx = () => useContext(AuthCtx);
