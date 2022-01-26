import { useAuthState } from "react-firebase-hooks/auth";
import { clientAuth } from "~/utils/firebase/clientApp";
import { signOut } from "firebase/auth";

export const useAuth = () => useAuthState(clientAuth);
export const signOutUser = () => signOut(clientAuth);
