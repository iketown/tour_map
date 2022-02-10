import { createContext, useContext, useState } from "react";
import { useLegs } from "~/hooks/useLegs";
import type { Dispatch, SetStateAction } from "react";

interface MapboxCtxI {
  selectedLeg: string;
  setSelectedLeg: Dispatch<SetStateAction<string>>;
  hiddenLegs: string[];
  setHiddenLegs: Dispatch<SetStateAction<string[]>>;
  toggleHiddenLeg: (legId: string) => void;
}

const MapboxCtx = createContext<MapboxCtxI>({} as MapboxCtxI);

export const MapboxCtxProvider: React.FC = ({ children }) => {
  const { legObj } = useLegs();
  const [selectedLeg, setSelectedLeg] = useState("");
  const [hiddenLegs, setHiddenLegs] = useState<string[]>([]);
  const toggleHiddenLeg = (legId: string) => {
    if (hiddenLegs.includes(legId)) {
      setHiddenLegs((old) => old.filter((id) => id !== legId));
    } else {
      setHiddenLegs((old) => [...old, legId]);
    }
  };
  return (
    <MapboxCtx.Provider
      value={{
        selectedLeg,
        setSelectedLeg,
        hiddenLegs,
        setHiddenLegs,
        toggleHiddenLeg,
      }}
    >
      {children}
    </MapboxCtx.Provider>
  );
};

export const useMapboxCtx = () => useContext(MapboxCtx);
