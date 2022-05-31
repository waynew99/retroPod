import React from "react";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="600"
      version="1.1"
      viewBox="0 0 900 600"
    >
      <defs>
        <filter id="blur1" width="120%" height="120%" x="-10%" y="-10%">
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur"
            stdDeviation="161"
          ></feGaussianBlur>
        </filter>
      </defs>
      <path fill="#933838" d="M0 0H900V600H0z"></path>
      <g filter="url(#blur1)">
        <circle cx="407" cy="295" r="357" fill="#191940"></circle>
        <circle cx="602" cy="582" r="357" fill="#933838"></circle>
        <circle cx="591" cy="365" r="357" fill="#191940"></circle>
        <circle cx="96" cy="271" r="357" fill="#191940"></circle>
        <circle cx="539" cy="129" r="357" fill="#933838"></circle>
        <circle cx="782" cy="346" r="357" fill="#191940"></circle>
      </g>
    </svg>
  );
}

export default Icon;
