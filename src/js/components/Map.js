import React, { Component } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,  
} from "react-google-maps";
import MapMarker from './MapMarker';

let map;

export const getGoogleMapRef = () => {
  return map;
};

const setMapref = ref => {
  map = ref;
};

const recalculateMapBounds = markers => {
  const map = getGoogleMapRef();
  if (!map || !markers || markers.length <= 0) {
    return;
  }
  const bounds = new window.google.maps.LatLngBounds();
  markers.forEach(marker => {
    const location = new window.google.maps.LatLng(
      marker.coordinates.lat,
      marker.coordinates.lng
    );
    bounds.extend(location);
  });
  map.fitBounds(bounds);
};

const onToggleOpen = isOpen => {
    return !isOpen;
  };

export default withScriptjs(
  withGoogleMap(props => {
    // recalculateMapBounds(props.markers);    
    const lat = props.lat;
    const lng = props.lng;
    return (      
      <GoogleMap
        ref={setMapref}
        defaultZoom={14}
        defaultCenter={{ lat: -27.4698, lng: 153.0251 }}
        center={{ lat: lat, lng: lng }}
      >
        {props.markers &&
          props.markers.length > 0 &&
          props.markers.map(marker => {
            return (
              <MapMarker key={marker.id} position={marker.coordinates} name={marker.name}>                
              </MapMarker>
            );
          })}
      </GoogleMap>
    );
  })
);
