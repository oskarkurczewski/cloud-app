import React from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";

const ErrorMessage = ({
  title = "Błąd",
  text,
}: {
  title: string;
  text: any;
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    backgroundColor: "#ff6060",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  text: {
    color: "#5f1414",
  },
  title: {
    fontWeight: "700",
  },
});

export default ErrorMessage;
