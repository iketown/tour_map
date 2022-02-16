import * as React from "react";

function MyMapPin(props) {
  return (
    <svg data-name="Layer 1" viewBox="0 0 141.41 170.7" {...props}>
      <path d="M120.7 20.71a70.7 70.7 0 00-100 100l50 50 50-50a70.69 70.69 0 000-100zM112 112a58.36 58.36 0 110-82.53 58.36 58.36 0 010 82.53z" />
    </svg>
  );
}

const MemoMyMapPin = React.memo(MyMapPin);
export default MemoMyMapPin;
