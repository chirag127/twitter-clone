import React from 'react';
import { Box, VStack, Text, Input, Icon, Pressable, HStack, Avatar, Button } from 'native-base'; // Added Pressable, HStack, Avatar, Button
import { MaterialIcons } from '@expo/vector-icons';
import UserCard from './UserCard'; // Import UserCard if needed, or build inline

// Placeholder data - replace with API calls later
const trends = [
  { category: 'Trending in India', topic: '#ghibliistyle', posts: '19.5K posts' },
  { category: 'Travel · Trending', topic: '#TrainAccident', posts: '2,118 posts' },
  { category: 'Entertainment · Trending', topic: '#SikandarReview', posts: '36.2K posts' },
];

const suggestions = [
    { id: 'nb', name: 'NativeBase', handle: 'nativebase', avatar: 'https://via.placeholder.com/150/1ee8a4', isFollowing: false },
    { id: 'expo', name: 'Expo', handle: 'expo', avatar: 'https://via.placeholder.com/150/66b7d2', isFollowing: true }, // Example: already following
]

const RightPanel = () => {

  // Placeholder function for follow toggle
  const handleFollowToggle = (userId: string) => {
      console.log("Toggle follow for user:", userId);
      // TODO: Implement API call and update state
  }

  return (
    <VStack space={4} mt={1}> {/* Added margin top */}
      {/* Search Bar */}
      <Input
        placeholder="Search" // Changed placeholder
        variant="filled"
        bg="gray.800" // Dark background for search
        borderRadius="full"
        borderColor="gray.800" // Match background
        _focus={{ bg: "black", borderColor: "blue.500" }} // Focus style: black bg, blue border
        color="white" // Text color
        placeholderTextColor="gray.500" // Placeholder color
        InputLeftElement={<Icon as={<MaterialIcons name="search" />} size={5} ml="3" color="gray.500" />} // Adjusted margin
      />

      {/* What's Happening / Trends */}
      <Box bg="gray.900" p={4} borderRadius="lg"> {/* Slightly lighter dark background */}
        <Text fontSize="xl" fontWeight="bold" mb={3} color="white">What's happening</Text>
        <VStack space={4}>
          {trends.map((trend) => (
            <Pressable key={trend.topic} _hover={{ bg: "gray.800" }} p={1} borderRadius="md">
              <VStack>
                <Text fontSize="xs" color="gray.500">{trend.category}</Text>
                <Text fontSize="md" fontWeight="bold" color="white">{trend.topic}</Text>
                <Text fontSize="xs" color="gray.500">{trend.posts}</Text>
              </VStack>
              {/* TODO: Add More icon (...) */}
            </Pressable>
          ))}
          {/* Show More Link */}
          <Pressable mt={2}>
            <Text color="blue.500">Show more</Text>
          </Pressable>
        </VStack>
      </Box>

      {/* Who to Follow */}
      <Box bg="gray.900" p={4} borderRadius="lg">
         <Text fontSize="xl" fontWeight="bold" mb={3} color="white">Who to follow</Text>
         <VStack space={4}>
            {suggestions.map((user) => (
                // Using inline structure similar to UserCard for now
                <HStack key={user.id} alignItems="center" space={3}>
                    <Avatar size="sm" source={{ uri: user.avatar }} />
                    <VStack flex={1}>
                        <Text fontWeight="bold" fontSize="sm" color="white" isTruncated noOfLines={1}>{user.name}</Text>
                        <Text color="gray.500" fontSize="sm" isTruncated noOfLines={1}>@{user.handle}</Text>
                    </VStack>
                    <Button
                        size="sm"
                        variant={user.isFollowing ? "outline" : "solid"} // Use outline if following
                        colorScheme={user.isFollowing ? "white" : "white"} // Adjust color scheme
                        bg={user.isFollowing ? "transparent" : "white"} // White bg for Follow
                        borderColor={user.isFollowing ? "gray.600" : "transparent"} // Border for Following
                        borderRadius="full"
                        onPress={() => handleFollowToggle(user.id)}
                        _text={{ color: user.isFollowing ? "white" : "black", fontWeight: "bold" }} // Text color
                    >
                        {user.isFollowing ? "Following" : "Follow"}
                    </Button>
                </HStack>
            ))}
         </VStack>
         <Pressable mt={3}>
            <Text color="blue.500">Show more</Text>
         </Pressable>
      </Box>

      {/* Footer Links */}
      <Text fontSize="xs" color="gray.500" flexWrap="wrap"> {/* Adjusted font size */}
        Terms of Service Privacy Policy Cookie Policy Accessibility Ads info More ... © 2025 X Corp.
      </Text>
    </VStack>
  );
};

export default RightPanel;