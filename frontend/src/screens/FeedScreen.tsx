import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator';
import Tweet from '../components/Tweet';
import { Box, FlatList, View, HStack, VStack, Text, Pressable, Divider, Avatar, TextArea, Icon, Button } from 'native-base'; // Added VStack
import { MaterialIcons } from '@expo/vector-icons'; // For composer icons

type Props = NativeStackScreenProps<AppStackParamList, 'Feed'>;

// Dummy data for tweets
const dummyTweets = [
  // ... (keep existing dummyTweets array)
  {
    id: '1',
    content: 'Just setting up my twttr clone! #ReactNative #Expo #NativeBase',
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
    content: 'React Native development is fun! Building cool stuff with a dark theme now.',
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
    content: 'Exploring the capabilities of Expo for cross-platform development. NativeBase helps with styling!',
    author: { name: 'Expo Fan', handle: 'expofanatic', avatar: 'https://via.placeholder.com/150/d32776' },
    timestamp: '3h',
    likes: 15,
    retweets: 2,
    replies: 1,
    isLiked: false,
    isRetweeted: true,
  },
];

// Dummy user data for composer avatar
const composerUser = {
    avatar: 'https://via.placeholder.com/150/771796' // Use the same avatar as dummyUser for now
};

const FeedScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<'For you' | 'Following'>('For you');
  const [tweetContent, setTweetContent] = useState('');

  const renderHeader = () => (
    <>
      {/* Tabs Header */}
      <HStack borderBottomWidth={1} borderColor="gray.800">
        {['For you', 'Following'].map((tabName) => {
          const isActive = activeTab === tabName;
          return (
            <Pressable
              key={tabName}
              flex={1}
              onPress={() => setActiveTab(tabName as 'For you' | 'Following')}
              alignItems="center"
              py={3}
              _hover={{ bg: 'gray.800' }}
            >
              <Text
                color={isActive ? 'white' : 'gray.500'}
                fontWeight={isActive ? 'bold' : 'medium'}
                fontSize="md"
              >
                {tabName}
              </Text>
              {/* Active Indicator */}
              {isActive && <Box bg="blue.500" h="1" w="16" borderRadius="full" mt={2} />}
            </Pressable>
          );
        })}
      </HStack>

      {/* What's Happening Composer */}
      <HStack p={4} space={3} borderBottomWidth={1} borderColor="gray.800">
         <Avatar size="md" source={{ uri: composerUser.avatar }} />
         <VStack flex={1}>
            <TextArea
                {...{ // Wrap props in an object and cast to any
                    placeholder: "What's happening?!",
                    value: tweetContent,
                    onChangeText: setTweetContent,
                    variant: "unstyled", // Remove default borders/bg
                    fontSize: "lg",
                    color: "white",
                    placeholderTextColor: "gray.500",
                    borderWidth: 0, // Ensure no border
                    py: 2, // Adjust padding
                    h: 20, // Set initial height
                    autoCompleteType: "off"
                } as any} // Cast props object to any
            />
            {/* Action Icons & Post Button */}
            <HStack justifyContent="space-between" alignItems="center" mt={3}>
                <HStack space={4}>
                    <Icon as={MaterialIcons} name="image" size="md" color="blue.500" />
                    <Icon as={MaterialIcons} name="gif-box" size="md" color="blue.500" />
                    <Icon as={MaterialIcons} name="poll" size="md" color="blue.500" />
                    <Icon as={MaterialIcons} name="sentiment-satisfied-alt" size="md" color="blue.500" />
                    <Icon as={MaterialIcons} name="calendar-today" size="md" color="blue.500" />
                    {/* Location icon might need different library */}
                </HStack>
                <Button
                    size="sm"
                    bg="blue.500"
                    borderRadius="full"
                    isDisabled={!tweetContent.trim()} // Disable if no content
                    _disabled={{ bg: 'blue.500:alpha.50' }}
                    onPress={() => console.log("TODO: Post Tweet:", tweetContent)}
                >
                    Post
                </Button>
            </HStack>
         </VStack>
      </HStack>
    </>
  );

  return (
    <Box flex={1} bg="black">
      <FlatList
        data={dummyTweets} // TODO: Filter based on activeTab
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
        ListHeaderComponent={renderHeader} // Add the header/composer here
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#2f3336',
  },
});

export default FeedScreen;