import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Variables from "./constants/Variables";
import UserContext from "./context/UserContext";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

axios.defaults.baseURL = Variables.url;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [userId, setUserId] = useState(null);

  const userObject = {
    userId,
    setUserId,
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UserContext.Provider value={userObject}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </UserContext.Provider>
    );
  }
}
