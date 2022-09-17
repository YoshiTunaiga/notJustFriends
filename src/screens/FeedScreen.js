import { ScrollView, FlatList } from "react-native";
import FeedPost from "../components/FeedPost/index";
import posts from "../../assets/data/posts.json";

const FeedScreen = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <FeedPost post={item} />}
      />
    </ScrollView>
  );
};

export default FeedScreen;
