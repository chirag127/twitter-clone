import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator'; // Import correct ParamList
import Tweet from '../components/Tweet'; // Import the Tweet component

type Props = NativeStackScreenProps<AppStackParamList, 'Feed'>; // Use correct ParamList

// Dummy data for tweets
const dummyTweets = [
  {
    id: '1',
    content: 'Just setting up my twttr clone! #ReactNative #Expo',
    author: { name: 'Roo Dev', handle: 'roodev', avatar: 'https://via.placeholder.com/150/771796' },
    timestamp: '10m',
    likes: 5,
    retweets: 1,
    replies: 0,
    isLiked: false,
    isRetweeted: false,
  },
  {
    id: '2',
    content: 'React Native development is fun! Building cool stuff.',
    author: { name: 'Jane Coder', handle: 'janecodes', avatar: 'https://via.placeholder.com/150/24f355' },
    timestamp: '1h',
    likes: 25,
    retweets: 8,
    replies: 3,
    isLiked: true,
    isRetweeted: false,
  },
  {
    id: '3',
    content: 'Exploring the capabilities of Expo for cross-platform development.',
    author: { name: 'Expo Fan', handle: 'expofanatic', avatar: 'https://via.placeholder.com/150/d32776' },
    timestamp: '3h',
    likes: 15,
    retweets: 2,
    replies: 1,
    isLiked: false,
    isRetweeted: true,
  },
];

const FeedScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyTweets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Tweet
            id={item.id}
            content={item.content}
            author={item.author}
            timestamp={item.timestamp}
            likes={item.likes}
            retweets={item.retweets}
            replies={item.replies}
            isLiked={item.isLiked}
            isRetweeted={item.isRetweeted}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background for the feed
  },
  separator: {
    height: 1,
    backgroundColor: '#E1E8ED', // Light grey separator line
  },
});

export default FeedScreen;