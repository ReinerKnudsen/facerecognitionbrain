import React from "react";
import Tilt from "react-parallax-tilt";
import bear from "./bear-face.png";
import "./Logo.css";

const Logo = () => {
  return (
    <div className="Tilt">
      <Tilt
        className="parallax-effect-img ma4 mt0 br2 shadow-2 pa3 logo"
        tiltMaxAngleX={80}
        tiltMaxAngleY={80}
        perspective={800}
        transitionSpeed={1500}
        scale={1.1}
        gyroscope={true}
      >
        <img src={bear} alt="bear" />
      </Tilt>
    </div>
  );
};

export default Logo;
