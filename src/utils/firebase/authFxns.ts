import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { clientAuth } from "./clientApp";

interface EmailAuthProps {
  email: string;
  password: string;
}
export const createUser = ({ email, password }: EmailAuthProps) => {
  return createUserWithEmailAndPassword(getAuth(), email, password);
};

export const signInUser = ({ email, password }: EmailAuthProps) => {
  return signInWithEmailAndPassword(getAuth(), email, password);
};
