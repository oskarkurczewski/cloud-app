import React, {useContext} from 'react';
import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View } from '../components/Themed';
import UserContext from "../context/UserContext";

export default function TabTwoScreen() {

  const userContext: any = useContext(UserContext);

  const onLogin = () => {
    console.log('logowanie')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj, {userContext.userName}!</Text>
      <View style={styles.separator}/>
      <View style={styles.instructions}>
        <Text style={styles.content}>1. Aby <Text style={styles.start}>rozpocząć</Text> swoją trasę, przejdź do widoku mapy i użyj przycisku <Text style={styles.start}>START.</Text></Text>
        <Text style={styles.content}>2. Aby <Text style={styles.stop}>zakończyć</Text> swoją trasę, przejdź do widoku mapy i użyj przycisku <Text style={styles.stop}>STOP.</Text></Text>
        <Text style={styles.content}>3. Aby <Text style={styles.trasa}>wyświetlić</Text> swoją trasę, przejdź do widoku mapy i użyj przycisku <Text style={styles.trasa}>TRASA.</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  instructions: {
    marginHorizontal: 60,
  },
  content: {
    color: 'black',
    fontSize: 15,
    marginTop: 7,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: 'black',
  },
  start: {
    color: 'green',
    fontWeight: 'bold',
  },
  stop: {
    color: 'red',
    fontWeight: 'bold',
  },
  trasa: {
    color: Colors.light.tabIconSelected,
    fontWeight: 'bold',
  },
});
