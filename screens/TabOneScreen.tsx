import React, {useEffect} from 'react';
import { Platform, StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import Map from '../components/Map';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen(this: any, { navigation }: RootTabScreenProps<'TabOne'>) {

  // navigation.reset({
  //   index: 0,
  //   routes: [{name: 'R'}],
  // })
 
  return (
    <View style={styles.container}>
      <Map/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
