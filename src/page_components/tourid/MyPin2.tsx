import React from "react";

interface MyPinI {
  color1: string;
  color2: string;
}

const MyPin: React.FC<MyPinI> = ({ color1, color2 }) => {
  return (
    <svg data-name="Layer 1" viewBox="0 0 150 175">
      <path
        d="M126.07 21.78A72.23 72.23 0 0023.93 123.93L75 175l51.07-51.07a72.23 72.23 0 000-102.15zM117.15 115a59.61 59.61 0 110-84.31 59.61 59.61 0 010 84.31z"
        fill={color1}
      />
      <path
        d="M75 13.24a59.62 59.62 0 1059.61 59.62A59.61 59.61 0 0075 13.24zm0 112.08a52.46 52.46 0 1152.46-52.46A52.46 52.46 0 0175 125.32z"
        fill={color2}
      />
    </svg>
  );
};

const MemoMyPin = React.memo(MyPin);
export default MemoMyPin;
