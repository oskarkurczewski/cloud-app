import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      {/* <View style={styles.separator} lightColor="grey" darkColor="grey" /> */}
      <Text style={styles.title}>O aplikacji</Text>
      <View style={styles.separator} lightColor="grey" darkColor="grey" />
      <Text style={styles.description}>Aplikacja służy do śledzenia położenia użytkownika i jego trasy.</Text>
      <View style={styles.separator} lightColor="grey" darkColor="grey" />
      <Text style={styles.title}>Autorzy</Text>
      <View style={styles.separator} lightColor="grey" darkColor="grey" />
      <Text style={styles.description}>Oskar Kurczewski</Text>
      <Text style={styles.description}>Filip Michalski</Text>
      <Text style={styles.description}>Michał Tosik</Text>
      <Text style={styles.subject}>Przetwarzanie danych w chmurze 21/22</Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  description: {
    fontSize: 15,
    color: 'black',
    marginLeft: 45,
    marginRight: 45,
  },
  subject: {
    position: 'absolute',
    left: '20%',
    color: 'grey',
    bottom: 10,
  }
});
