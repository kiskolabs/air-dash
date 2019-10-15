import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faEmptyHeart } from "@fortawesome/free-regular-svg-icons";

import "./HealthIndex.css";

export default ({ value, label, color }) => {
  const emptyStars = value;
  const fullStars = 5 - emptyStars;

  let stars = [];

  for (let i = 1; i <= fullStars; i++) {
    stars.push(<FontAwesomeIcon fixedWidth key={`star-${i}`} icon={faHeart} size="1x" />);
  }

  for (let i = 1; i <= emptyStars; i++) {
    stars.push(<FontAwesomeIcon fixedWidth key={`empty-${i}`} icon={faEmptyHeart} size="1x" />);
  }

  return (
    <div className={`HealthIndex ${color}`}>
      {stars} <br />
      <span>{label}</span>
    </div>
  );
};
