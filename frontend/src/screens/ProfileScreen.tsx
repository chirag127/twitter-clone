import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator'; // Import correct ParamList
import Tweet from '../components/Tweet'; // Assuming we'll show tweets here

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>; // Use correct ParamList

// Dummy user data (replace with actual data fetching later)
const dummyUser = {
  id: 'user123',
  name: 'Roo Dev',
  handle: 'roodev',
  avatar: 'https://via.placeholder.com/150/771796',
  bio: 'Building a Twitter clone with React Native & Expo! 🚀',
  followingCount: 50,
  followersCount: 100,
};

// Dummy tweets for the profile (replace with actual data fetching later)
const dummyProfileTweets = [
  {
    id: 'p1',
    content: 'My first tweet on the profile screen!',
    author: dummyUser, // Use the dummy user as author
    timestamp: '2m',
    likes: 2,
    retweets: 0,
    replies: 0,
    isLiked: false,
    isRetweeted: false,
  },
   {
    id: 'p2',
    content: 'Loving this profile view setup.',
    author: dummyUser,
    timestamp: '5m',
    likes: 10,
    retweets: 1,
    replies: 1,
    isLiked: true,
    isRetweeted: false,
  },
];


const ProfileScreen = ({ route, navigation }: Props) => {
  // In a real app, you'd fetch user data based on route.params.userId
  // For now, we use dummy data
  const user = dummyUser;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.handle}>@{user.handle}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}><Text style={styles.statsNumber}>{user.followingCount}</Text> Following</Text>
          <Text style={styles.statsText}><Text style={styles.statsNumber}>{user.followersCount}</Text> Followers</Text>
        </View>
      </View>

      <View style={styles.tweetsContainer}>
        <Text style={styles.sectionTitle}>Tweets</Text>
        {dummyProfileTweets.map((tweet) => (
           <Tweet
            key={tweet.id} // Use key prop when mapping
            id={tweet.id}
            content={tweet.content}
            author={tweet.author}
            timestamp={tweet.timestamp}
            likes={tweet.likes}
            retweets={tweet.retweets}
            replies={tweet.replies}
            isLiked={tweet.isLiked}
            isRetweeted={tweet.isRetweeted}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 16,
    color: '#657786',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#14171A',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statsText: {
    fontSize: 16,
    color: '#657786',
    marginHorizontal: 10,
  },
  statsNumber: {
    fontWeight: 'bold',
    color: '#14171A',
  },
  tweetsContainer: {
    marginTop: 10,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      paddingHorizontal: 15,
      marginBottom: 10,
  }
});

export default ProfileScreen;