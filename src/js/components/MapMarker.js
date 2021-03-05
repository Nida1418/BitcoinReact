import React, { Component } from "react";
import { Marker, InfoWindow } from "react-google-maps";

export default class MapMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfoOpen: false
    };
  }

  onInfoToggle = () => {
    this.setState({
      isInfoOpen: !this.state.isInfoOpen
    });
  };

  render() {
    return (
      <Marker
        position={this.props.position}
        onClick={this.onInfoToggle}                
        name={this.props.name}
      >
        {this.state.isInfoOpen && (
          <InfoWindow onCloseClick={this.onInfoToggle}>
            <div>{this.props.name}</div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}
