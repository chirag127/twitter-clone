import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: author.avatar }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{author.name}</Text>
          <Text style={styles.handle}>@{author.handle}</Text>
          <Text style={styles.timestamp}>· {timestamp}</Text>
        </View>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem}>
            <Feather name="message-circle" size={18} color="#657786" />
            <Text style={styles.actionText}>{replies}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <MaterialIcons
              name="repeat"
              size={20}
              color={isRetweeted ? "#17BF63" : "#657786"}
            />
            <Text style={[styles.actionText, isRetweeted && styles.retweeted]}>
              {retweets}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <AntDesign
              name="heart"
              size={18}
              color={isLiked ? "#E0245E" : "#657786"}
            />
            <Text style={[styles.actionText, isLiked && styles.liked]}>
              {likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Feather name="share" size={18} color="#657786" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  handle: {
    color: '#657786',
    marginRight: 5,
  },
  timestamp: {
    color: '#657786',
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 60,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#657786',
    marginLeft: 5,
    fontSize: 14,
  },
  liked: {
    color: '#E0245E',
  },
  retweeted: {
    color: '#17BF63',
  },
});

export default Tweet;