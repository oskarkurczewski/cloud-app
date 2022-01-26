import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { LocationObject } from 'expo-location';
import Colors from '../constants/Colors';


const Map = () => {
    const [location, setLocation] = useState<any | null>({"timestamp":0,"mocked":false,"coords":{"altitude":0,"heading":0,"altitudeAccuracy":0,"latitude":0,"speed":0,"longitude":0,"accuracy":0}});
    const [errorMsg, setErrorMsg] = useState<any | null>(null);

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg("Permission to access location was denied");
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
          setLocation(location);
        })();
      }, []);
    
      let text = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        
        text = JSON.stringify(location);
        
      }
    
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0115,
        longitudeDelta: 0.0015
      };

      return (
        <View style={styles.container}>
          <MapView provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          >
            <Marker draggable
              coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
            >
              <View style={styles.marker}>
                <Text style={styles.pinText}>you</Text>
              </View>
              </Marker> 
           </MapView>
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        },
        paragraph: {
          fontSize: 18,
          textAlign: 'center',
        },
        map: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        },
        pinText: {
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 12,
          marginTop: 6,
        },
        marker: {
          width: 30,
          height: 30,
          borderRadius: 30 / 2,
          backgroundColor: Colors.dark.tabIconSelected,
        }
      });

export default Map;