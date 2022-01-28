import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import axios from "axios";

export default function RegistrationScreen({
  navigation,
}: RootStackScreenProps<"Register">) {
  const onRegister = async () => {
    if (password != repeat) return;

    try {
      await axios.post("/auth/signup", {
        login,
        email,
        password,
      });
    } catch (error) {
      console.log("error while registering", error);
    }
    navigation.goBack();
  };

  const onBack = () => {
    navigation.goBack();
  };

  const [login, onChangeLogin] = React.useState("");
  const [email, onChangeEmail] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [repeat, onChangeRepeat] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zarejestruj się!</Text>
      <SafeAreaView>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Login:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeLogin(text)}
            value={login}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Email:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeEmail(text)}
            value={email}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Hasło:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangePassword(text)}
            value={password}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Powtórz hasło:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeRepeat(text)}
            value={repeat}
          />
        </View>
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <Button onPress={onRegister} title="Zarejestruj się" />
        <Button onPress={onBack} title="Anuluj" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    // flex: 1,
    // marginTop: 84,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    marginTop: 80,
    // marginBottom: 70,
    fontSize: 50,
    fontWeight: "bold",
    color: Colors.dark.symbols,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    height: 50,
    width: 220,
    paddingLeft: 10,
    // marginTop: 20,
    borderWidth: 3,
    borderRadius: 5,
    borderColor: Colors.dark.tint,
  },
  inputContainer: {
    // marginTop: 20,
  },
  inputDescription: {
    marginLeft: 10,
    marginBottom: 3,
  },
});
