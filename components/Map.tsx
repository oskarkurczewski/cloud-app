import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { LocationObject } from "expo-location";
import Colors from "../constants/Colors";

const Map = () => {
  const [location, setLocation] = useState<any | null>({
    timestamp: 0,
    mocked: false,
    coords: {
      altitude: 0,
      heading: 0,
      altitudeAccuracy: 0,
      latitude: 0,
      speed: 0,
      longitude: 0,
      accuracy: 0,
    },
  });
  const [errorMsg, setErrorMsg] = useState<any | null>(null);
  const [refreshUserLocalisation, setRefreshUserLocalisation] = useState(true);

  // useEffect(() => {
  //     (async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== 'granted') {
  //         setErrorMsg("Permission to access location was denied");
  //         return;
  //       }

  //       let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
  //       setLocation(location);
  //     })();
  //   }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          timeInterval: 5000,
          accuracy: Location.Accuracy.Highest,
        },
        (loc) => {
          const payload = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setLocation(payload);
        }
      );
    })();
  }, []);

  // const TIME_MS = 300000;
  const TIME_MS = 1000;
  console.log("lokalizacja: ", location);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log("lokalizacja: ", location);
  //     setRefreshUserLocalisation(!refreshUserLocalisation);
  //   }, TIME_MS);

  //   return () => clearInterval(interval);
  // }, [refreshUserLocalisation]);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0115,
    longitudeDelta: 0.0015,
  };

  const _map = React.useRef(null);

  return (
    <View style={styles.container}>
      {region.latitude != undefined ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={_map}
          style={styles.map}
          initialRegion={region}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <View style={styles.marker}>
              <Text style={styles.pinText}>you</Text>
            </View>
          </Marker>
        </MapView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  pinText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    marginTop: 6,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: Colors.dark.tabIconSelected,
  },
});

export default Map;