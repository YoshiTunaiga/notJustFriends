import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigator from "./src/navigation";
import CreatePostScreen from "./src/screens/CreatePostScreen";
// import FeedScreen from "./src/screens/FeedScreen";

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <View>
        <StatusBar />
        <Navigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
