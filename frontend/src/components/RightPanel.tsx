import React from 'react';
import { Box, VStack, Text, Input, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

// Placeholder data - replace with API calls later
const trends = [
  { category: 'Technology · Trending', topic: '#ReactJS', posts: '15.1K posts' },
  { category: 'Sports · Trending', topic: '#WorldCup', posts: '1M posts' },
  { category: 'News · Trending', topic: 'ElectionResults', posts: '500K posts' },
];

const suggestions = [
    { name: 'NativeBase', handle: 'nativebase', avatar: 'https://via.placeholder.com/150/1ee8a4' },
    { name: 'Expo', handle: 'expo', avatar: 'https://via.placeholder.com/150/66b7d2' },
]

const RightPanel = () => {
  return (
    <VStack space={6}>
      {/* Search Bar */}
      <Input
        placeholder="Search Twitter"
        variant="filled" // Or "outline", "rounded", etc.
        borderRadius="full"
        InputLeftElement={<Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" />}
      />

      {/* What's Happening / Trends */}
      <Box bg="gray.100" p={4} borderRadius="lg">
        <Text fontSize="xl" fontWeight="bold" mb={3}>What's happening</Text>
        <VStack space={4}>
          {trends.map((trend) => (
            <Box key={trend.topic}>
              <Text fontSize="sm" color="gray.500">{trend.category}</Text>
              <Text fontSize="md" fontWeight="bold">{trend.topic}</Text>
              <Text fontSize="sm" color="gray.500">{trend.posts}</Text>
            </Box>
          ))}
          {/* Show More Link */}
          <Text color="blue.500" mt={2}>Show more</Text>
        </VStack>
      </Box>

      {/* Who to Follow */}
      <Box bg="gray.100" p={4} borderRadius="lg">
         <Text fontSize="xl" fontWeight="bold" mb={3}>Who to follow</Text>
         {/* Add UserCard components here later */}
         <Text color="blue.500" mt={2}>Show more</Text>
      </Box>

      {/* Footer Links */}
      <Text fontSize="sm" color="gray.500">
        Terms of Service Privacy Policy Cookie Policy Accessibility Ads info More ... © 2025 X Corp.
      </Text>
    </VStack>
  );
};

export default RightPanel;