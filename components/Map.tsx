import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { LocationObject } from "expo-location";
import Colors from "../constants/Colors";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";
import UserContext from "../context/UserContext";

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

const Map = () => {
  const userContext: any = useContext(UserContext);
  console.log("context", userContext);

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
  const [bufferArray, setBufferArray] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [point, setPoints] = useState([ ]);
  const netInfo = useNetInfo();

  const storeData = async (value: any) => {
    try {
      let data = await getData();

      if (data != null) {
        console.log("storuje jesli nie null");
        data.push(value);
        await AsyncStorage.setItem("@storage_Key", JSON.stringify(data));
      } else {
        console.log("storuje jesli null");
        await AsyncStorage.setItem("@storage_Key", JSON.stringify([value]));
      }
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@storage_Key");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const toggleTracking = React.useRef();

  const subTracking = async () => {
    setPoints([])
    console.log("id", userContext.userId);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    toggleTracking.current = await Location.watchPositionAsync(
      {
        timeInterval: 5000,
        accuracy: Location.Accuracy.Highest,
      },
      (loc) => {
        const payload = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        console.log("tak o");
        try {
          let date = new Date().getTime();
          
          const result: any =
         axios.put(`/location/user/${userContext.userId}`, {
          location: {...payload, timestamp: date}
        })
        } catch (e) {
          console.log(e);
        }
        
        setLocation(payload);
      }
    );
    console.log("wlaczylem");
  };

  const stopTracking = async () => {
    toggleTracking.current.remove();
    console.log("wylaczylem");

  };

  const showTrack = async () => {
    const points = await axios.get(`/location/user/${userContext.userId}`)
    let newLocation:any = [];
    points.data.data.map((location:any, index:any) => {
      newLocation.push({ latitude: location.latitude, longitude: location.longitude, timestamp: location.timestamp })
    })
    await axios.delete(`/location/user/${userContext.userId}/all`)
    setPoints(newLocation);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (netInfo.isConnected) {
        // wyslanie bufora i czyszczenie bufora
      }

      if (!netInfo.isConnected) {
        let date = new Date().getTime();

        storeData({ ...location, timestamp: date });
      }
    })();
  }, [toggle]);

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
      {region.latitude != undefined || location?.coords?.latitude != 0 ? (
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
          <Polyline
            coordinates={point}
            strokeColor="#000"
            strokeColors={[
              "#7F0000",
              "#00000000",
              "#B24112",
              "#E5845C",
              "#238C23",
              "#7F0000",
            ]}
            strokeWidth={2}
          />
        </MapView>
      ) : null}
      <View style={styles.myLocation}>
        <Pressable style={styles.iconGreen} onPress={showTrack}>
          <Text style={styles.iconText}>TRASA</Text>
        </Pressable>
      </View>
      <View style={styles.myLocation2}>
        <Pressable style={styles.iconRed} onPress={subTracking}>
          <Text style={styles.iconText}>START</Text>
        </Pressable>
      </View>
      <View style={styles.myLocation3}>
        <Pressable style={styles.iconPink} onPress={stopTracking}>
          <Text style={styles.iconText}>STOP</Text>
        </Pressable>
      </View>
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
  myLocation: {
    position: "absolute",
    bottom: 240,
    right: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.light.symbols,
    borderRadius: 99,
    backgroundColor: Colors.light.symbols,
  },
  myLocation2: {
    position: "absolute",
    bottom: 360,
    right: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 99,
    backgroundColor: 'green',
  },
  myLocation3: {
    position: "absolute",
    bottom: 300,
    right: 35,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 99,
    backgroundColor: 'red',
  },
  iconGreen: {
    alignItems: "center",
    justifyContent: "center",

  },
  iconRed: {
    alignItems: "center",
    justifyContent: "center",

  },
  iconPink: {
    alignItems: "center",
    justifyContent: "center",
    
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Map;
