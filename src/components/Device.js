import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faLeaf,
  faStar,
  faThermometerQuarter,
  faTint,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";
import { distanceInWords } from "date-fns";

class Device extends Component {
  healthIndexToWords(index) {
    let word = "";

    switch (index) {
      case 0:
        word = "Health";
        break;
      case 1:
        word = "Fine";
        break;
      case 2:
        word = "Fair";
        break;
      case 3:
        word = "Poor";
        break;
      case 4:
        word = "Unhealthy";
        break;
      default:
        word = "—";
    }

    return word;
  }

  renderHealthIndex(index) {
    const emptyStars = index;
    const fullStars = 5 - emptyStars;

    let stars = [];

    for (let i = 1; i <= fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} />);
    }

    for (let i = 1; i <= emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faEmptyStar} />);
    }

    return stars;
  }

  render() {
    const {
      data: { station_name, dashboard_data, last_status_store },
    } = this.props;

    return (
      <div>
        <h1>{station_name}</h1>
        <dl>
          <dt>
            <FontAwesomeIcon icon={faThermometerQuarter} /> Temperature
          </dt>
          <dd>{dashboard_data.Temperature}°C</dd>

          <dt>
            <FontAwesomeIcon icon={faTint} /> Humidity
          </dt>
          <dd>{dashboard_data.Humidity}%</dd>

          <dt>
            <FontAwesomeIcon icon={faLeaf} /> CO₂
          </dt>
          <dd>{dashboard_data.CO2} ppm</dd>

          <dt>
            <FontAwesomeIcon icon={faVolumeUp} /> Noise
          </dt>
          <dd>{dashboard_data.Noise} dB</dd>

          <dt>
            <FontAwesomeIcon icon={faHeart} /> Health Index
          </dt>
          <dd>
            {this.renderHealthIndex(dashboard_data.health_idx)}{" "}
            {this.healthIndexToWords(dashboard_data.health_idx)}
          </dd>

          <dt>
            <FontAwesomeIcon icon={faClock} /> Last update
          </dt>
          <dd>{distanceInWords(new Date(), last_status_store, { addSuffix: true })}</dd>
        </dl>
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
