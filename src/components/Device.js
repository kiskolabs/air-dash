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
import { faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";

class Device extends Component {
  // 0 = healthy, 4 = unhealthy
  renderHealthIndex(index) {
    const emptyStars = index;
    const fullStars = 5 - emptyStars;
    console.log("index", index);
    console.log("emptyStars", emptyStars);
    console.log("fullStars", fullStars);

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
      data: { station_name, dashboard_data },
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
          <dd title={dashboard_data.health_idx}>
            {this.renderHealthIndex(dashboard_data.health_idx)}
          </dd>
        </dl>
      </div>
    );
  }
}

Device.defaultProps = {
  data: {},
};

export default Device;
