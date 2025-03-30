import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator';
import Tweet from '../components/Tweet';
import { Box, Text, Image, ScrollView, VStack, HStack, Avatar } from 'native-base'; // Use NativeBase components

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

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
    // Use ScrollView within a Box for dark background
    <Box flex={1} bg="black">
      <ScrollView>
        {/* TODO: Add Profile Header Image */}
        <VStack alignItems="center" p={4} borderBottomWidth={1} borderColor="gray.800">
          <Avatar size="xl" source={{ uri: user.avatar }} mb={3} mt={-12} /* Offset for header image overlap */ borderWidth={4} borderColor="black" />
          <Text fontSize="xl" fontWeight="bold" color="white">{user.name}</Text>
          <Text fontSize="md" color="gray.500" mb={2}>@{user.handle}</Text>
          <Text fontSize="md" textAlign="center" mb={3} color="white">{user.bio}</Text>
          <HStack space={4}>
            <Text color="white"><Text fontWeight="bold">{user.followingCount}</Text> Following</Text>
            <Text color="white"><Text fontWeight="bold">{user.followersCount}</Text> Followers</Text>
          </HStack>
          {/* TODO: Add Edit Profile Button */}
        </VStack>

        {/* TODO: Add Profile Tabs (Tweets, Replies, Media, Likes) */}

        <VStack>
          {/* <Text fontSize="lg" fontWeight="bold" p={4} color="white">Tweets</Text> */}
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
        </VStack>
      </ScrollView>
    </Box>
  );
};

// StyleSheet might not be needed if NativeBase handles all styling
// const styles = StyleSheet.create({});

export default ProfileScreen;