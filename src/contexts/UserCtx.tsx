import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import type { FC } from "react";

interface UserCtxI {}
const UserCtx = createContext<UserCtxI>({});

export const UserCtxProvider: FC = ({ children }) => {
  return <UserCtx.Provider value={{}}>{children}</UserCtx.Provider>;
};

export const useUserCtx = () => useContext(UserCtx);
