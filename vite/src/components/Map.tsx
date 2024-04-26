import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useCallback } from "react";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function Map({ userLocation, marker, setMarker }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  const [map, setMap] = useState(null);
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onMapClick = (event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  console.log("Maerker", marker);

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || marker}
          zoom={8}
          onClick={onMapClick}
          onUnmount={onUnmount}
        >
          <Marker position={marker} />
          <Marker position={marker} />
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
