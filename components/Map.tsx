import { View, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { useDriverStore, useLocationStore } from "@/store";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { MarkerData } from "@/types/type";
import { icons } from "@/constants";

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    // TODO: remove
    // @ts-ignore
    setDrivers(drivers);
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, []);
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
    </MapView>
  );
};

export default Map;
