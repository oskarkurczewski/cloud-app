import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { LocationObject } from "expo-location";
import Colors from "../constants/Colors";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';


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
  const [bufferArray, setBufferArray] = useState([]);
  const netInfo = useNetInfo();

  const storeData = async (value: any) => {
    try {
      let data = await getData();
      if (data != null) {
        console.log("storuje jesli nie null")
        let temp = JSON.parse(data);
        temp.push(value);
        await AsyncStorage.setItem('@storage_Key', JSON.stringify(temp));
      } else {
        console.log("storuje jesli null")
        
        await AsyncStorage.setItem('@storage_Key', JSON.stringify([value]));
      }
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

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
      //TODO:odwrocic warunki w isConnected 
      // console.log(location)
      // if (netInfo.isConnected) {
      //   if (bufferArray != []) {
      //   // wyslanie bufora
      //   console.log(await getData());
      //   }
      // }

      // if (!netInfo.isConnected) {
      //   let date = new Date().getTime()

      //   storeData({...location, timestamp: date})
      // } 


    })();
  }, []);



  

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //   });
  // }, [])


  // console.log("lokalizacja: ", location);
  // console.log("internet:", netInfo.isConnected)


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