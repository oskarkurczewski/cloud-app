import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import Button from "../components/Button";
import Colors from "../constants/Colors";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import UserContext from "../context/UserContext";
import jwt_decode from "jwt-decode";
import ErrorMessage from "../components/ErrorMessage";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<"Start">) {
  const userContext: any = useContext(UserContext);

  const onLogin = async () => {
    console.log("login");

    try {
      const result: any = await axios
        .post("/auth/signin", {
          login,
          password,
        })
        .catch((err) => Promise.reject(err));
      if (!result.headers["auth-token"]) return;
      await save("auth-token", result.headers["auth-token"]);
      axios.defaults.headers.common["auth-token"] =
        result.headers["auth-token"];
      const payload: any = jwt_decode(result.headers["auth-token"]);
      userContext.setUserId(payload._id);
      userContext.setUserName(login);
      console.log(await getValueFor("auth-token"));
      setErrorMessage("");
      // onChangeLogin("");
      // onChangePassword("");
      navigation.navigate("Root");
    } catch (error: any) {
      const err = await error;
      console.log("error while logging in", err);
      if (err.response.status == 400)
        setErrorMessage("Wprowadzono zły login albo hasło!");
      else setErrorMessage(error.message);
    }
  };

  const onRegister = () => {
    navigation.navigate("Register");
  };

  const [login, onChangeLogin] = React.useState("norbert");
  const [password, onChangePassword] = React.useState("czesc");
  const [errorMessage, setErrorMessage] = React.useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zaloguj się!</Text>
      <SafeAreaView>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Login:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeLogin}
            value={login}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputDescription}>Hasło:</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
          />
        </View>
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <Button onPress={onLogin} title="Zaloguj się" />
        <Button onPress={onRegister} title="Zarejestruj się" />
      </View>
      {errorMessage ? <ErrorMessage title="Błąd" text={errorMessage} /> : null}
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
    // marginTop: 175,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    width: "100%",
  },
  title: {
    marginTop: 80,
    marginBottom: 70,
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
    marginTop: 20,
  },
  inputDescription: {
    marginLeft: 10,
    marginBottom: 3,
  },
});
