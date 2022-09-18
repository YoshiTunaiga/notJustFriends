import { View, Text, Image, Pressable } from "react-native";
import {
  Entypo,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import LikeImage from "../../../assets/images/like.png";
import { styles } from "./styles";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { DataStore } from "aws-amplify";
import { User } from "../../models";
import { S3Image } from "aws-amplify-react-native";

const dummy_img =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/user.png";

export default function FeedPost({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!post.postUserId) {
      return;
    }
    DataStore.query(User, post.postUserId).then(setUser);
  }, [post.postUserId]);

  return (
    <View style={styles.container}>
      {/* Post component */}
      <View style={styles.post}>
        {/* Post Header with details about the author */}
        <Pressable
          onPress={() => navigation.navigate("Profile", { id: post.User?.id })}
          style={styles.header}
        >
          {user?.image ? (
            <S3Image imgKey={user.image} style={styles.profileImage} />
          ) : (
            <Image source={{ uri: dummy_img }} style={styles.profileImage} />
          )}
          {/* <Image
            source={{ uri: post.User.image }}
            style={styles.profileImage}
          /> */}
          <View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.subtitle}>{post.createdAt}</Text>
          </View>
          <Entypo
            name="dots-three-horizontal"
            size={18}
            color="gray"
            style={styles.icon}
          />
        </Pressable>
        {/* Post body with description and image */}
        <Text style={styles.description}>{post.description}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        {/* Post footer with likes and button */}
        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <Image source={LikeImage} style={styles.likeIcon} />
            <Text style={styles.likedBy}>
              Elon Musk and {post.numberOfLikes} others
            </Text>
            <Text style={styles.shares}>{post.numberOfShares} shares</Text>
          </View>
          <View style={styles.buttonsRow}>
            {/* Like button */}
            <Pressable
              onPress={() => setIsLiked(!isLiked)}
              style={styles.iconButton}
            >
              <AntDesign
                name="like2"
                size={18}
                color={isLiked ? "royalblue" : "gray"}
              />
              <Text
                style={[
                  styles.iconButtonText,
                  { color: isLiked ? "royalblue" : "gray" },
                ]}
              >
                Like
              </Text>
            </Pressable>

            {/* Comment button */}
            <View style={styles.iconButton}>
              <FontAwesome5 name="comment-alt" size={16} color="gray" />
              <Text style={styles.iconButtonText}>Comment</Text>
            </View>

            {/* Share button */}
            <View style={styles.iconButton}>
              <MaterialCommunityIcons
                name="share-outline"
                size={18}
                color="gray"
              />
              <Text style={styles.iconButtonText}>Share</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
