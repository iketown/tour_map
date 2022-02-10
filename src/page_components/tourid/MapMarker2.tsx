import * as React from "react";
import type { Color } from "@mui/material";
import { grey } from "@mui/material/colors";
interface MapMarkerI {
  color: Color;
  onClick?: () => void;
}

const MapMarker: React.FC<MapMarkerI> = ({ color = grey, onClick }) => {
  return (
    <svg
      height="24"
      width="24"
      style={{
        cursor: "pointer",
        transform: "translate(0,4px)",
      }}
      onClick={onClick}
    >
      <path
        d="M12 0a8 8 0 00-8 8c0 1.421.382 2.75 1.031 3.906.108.192.221.381.344.563L12 24l6.625-11.531c.102-.151.19-.311.281-.469l.063-.094A7.954 7.954 0 0020 8a8 8 0 00-8-8zm0 4a4 4 0 110 8 4 4 0 010-8z"
        fill={color[500]}
      />
      <path
        d="M12 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
        fill={color[900]}
      />
    </svg>
  );
};

const MemoMapMarker = React.memo(MapMarker);
export default MemoMapMarker;
