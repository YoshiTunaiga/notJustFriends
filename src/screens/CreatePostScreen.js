import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { DataStore, Auth, Storage } from "aws-amplify";
import { Post, User } from "../models";
import { v4 as uuidv4 } from "uuid";

const CreatePostScreen = () => {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState();

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await Auth.currentAuthenticatedUser();
      const dbUser = await DataStore.query(User, userData.attributes.sub);
      if (dbUser) {
        setUser(dbUser);
        console.log(dbUser);
      } else {
        navigation.navigate("Update profile");
      }
    };

    fetchUser();
  }, []);

  const onPost = async () => {
    const newPost = {
      description: description,
      numberOfLikes: 0,
      numberOfShares: 0,
      postUserId: user.id,
      _version: 1,
    };
    if (image) {
      newPost.image = await uploadFile(image);
    }
    await DataStore.save(new Post(newPost));
    setDescription("");
    setImage("");
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const key = `${uuidv4()}.png`;
      await Storage.put(key, blob, {
        contentType: "image/png", // contentType is optional
      });
      return key;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginBottom: insets.bottom }]}
      contentContainerStyle={{ flex: 1 }}
      keyboardVerticalOffset={150}
    >
      <View style={styles.header}>
        <Image source={{ uri: user?.image }} style={styles.profileImage} />
        <Text style={styles.name}>{user?.name}</Text>
        <Entypo
          onPress={pickImage}
          name="images"
          size={24}
          color="limegreen"
          style={styles.icon}
        />
      </View>
      <TextInput
        placeholder="What's on your mind?"
        // set the value of the TextInput to the value from state
        value={description}
        // When user types, TextInput will call the onChangeText callback with the new value
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button onPress={onPost} title="Post" disabled={!description} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    paddingTop: 30,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontWeight: "500",
  },
  input: {},
  // Button
  buttonContainer: {
    marginTop: "auto",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
});

export default CreatePostScreen;
