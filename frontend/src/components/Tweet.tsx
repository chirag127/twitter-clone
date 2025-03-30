import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text, Image, HStack, VStack, Icon, Pressable, Avatar } from 'native-base'; // Use NativeBase components
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';

interface TweetProps {
  id: string;
  content: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  isLiked: boolean;
  isRetweeted: boolean;
}

// Define colors for dark theme actions
const actionColor = "gray.500";
const likedColor = "pink.500"; // Use NativeBase color scale
const retweetedColor = "green.500";

const Tweet: React.FC<TweetProps> = ({
  content,
  author,
  timestamp,
  likes,
  retweets,
  replies,
  isLiked,
  isRetweeted,
}) => {
  return (
    // Use Box for container with padding and dark border
    <Box borderBottomWidth={1} borderColor="gray.800" px={4} py={3}>
      <HStack space={3}>
        {/* Avatar */}
        <Avatar size="md" source={{ uri: author.avatar }} />

        {/* Content Column */}
        <VStack flex={1}>
          {/* Header */}
          <HStack space={2} alignItems="center" mb={1}>
            <Text color="white" fontWeight="bold" fontSize="md">{author.name}</Text>
            <Text color="gray.500" fontSize="sm">@{author.handle}</Text>
            <Text color="gray.500" fontSize="sm">· {timestamp}</Text>
            {/* TODO: Add Verified Badge if applicable */}
            {/* TODO: Add More Options (...) button */}
          </HStack>

          {/* Tweet Content */}
          <Text color="white" fontSize="md" mb={2}>{content}</Text>
          {/* TODO: Add Image/Video display if present */}

          {/* Actions */}
          <HStack justifyContent="space-between" mt={2} pr={10}> {/* Added paddingRight */}
            {/* Reply */}
            <Pressable _hover={{ bg: "blue.500:alpha.10" }} borderRadius="full" p={1}>
              <HStack alignItems="center" space={1}>
                <Icon as={Feather} name="message-circle" size="sm" color={actionColor} />
                <Text fontSize="xs" color={actionColor}>{replies > 0 ? replies : ''}</Text>
              </HStack>
            </Pressable>

            {/* Retweet */}
            <Pressable _hover={{ bg: "green.500:alpha.10" }} borderRadius="full" p={1}>
              <HStack alignItems="center" space={1}>
                <Icon
                  as={MaterialIcons}
                  name="repeat"
                  size="md" // Slightly larger
                  color={isRetweeted ? retweetedColor : actionColor}
                />
                <Text fontSize="xs" color={isRetweeted ? retweetedColor : actionColor}>
                  {retweets > 0 ? retweets : ''}
                </Text>
              </HStack>
            </Pressable>

            {/* Like */}
            <Pressable _hover={{ bg: "pink.500:alpha.10" }} borderRadius="full" p={1}>
              <HStack alignItems="center" space={1}>
                <Icon
                  as={AntDesign}
                  name={isLiked ? "heart" : "hearto"} // Use filled/outline icon
                  size="sm"
                  color={isLiked ? likedColor : actionColor}
                />
                <Text fontSize="xs" color={isLiked ? likedColor : actionColor}>
                  {likes > 0 ? likes : ''}
                </Text>
              </HStack>
            </Pressable>

            {/* Share */}
            <Pressable _hover={{ bg: "blue.500:alpha.10" }} borderRadius="full" p={1}>
               <Icon as={Feather} name="share" size="sm" color={actionColor} />
            </Pressable>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
};

// StyleSheet might not be needed anymore if all styling is done via NativeBase props
// const styles = StyleSheet.create({});

export default Tweet;