import { useEffect, useRef, useState, createContext, useContext } from "react";
import Script from "next/script";
import { Loader } from "@googlemaps/js-api-loader";

interface MapCtxI {
  acService?: google.maps.places.AutocompleteService;
  placesService?: google.maps.places.PlacesService;
}
const MapCtx = createContext<MapCtxI>({});

export const MapWrap: React.FC = ({ children }) => {
  const [map, setMap] = useState();
  const [acService, setAcService] =
    useState<google.maps.places.AutocompleteService>();
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService>();
  const placesRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY!;
  const loader = new Loader({
    apiKey,
    version: "weekly",
    libraries: ["places"],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    loader.load().then((google) => {
      // set Autocomplete service
      const _acService = new google.maps.places.AutocompleteService();
      setAcService(_acService);
      // set Places service
      const placesDiv = placesRef.current;
      if (!placesDiv) return;
      const _placesService = new google.maps.places.PlacesService(placesDiv);
      setPlacesService(_placesService);
    });
  }, []);

  return (
    <MapCtx.Provider
      value={{
        acService,
        placesService,
      }}
    >
      {children}
      <div ref={placesRef} />
    </MapCtx.Provider>
  );
};

export const useMapCtx = () => useContext(MapCtx);
