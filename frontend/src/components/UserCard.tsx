import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface UserCardProps {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isFollowing: boolean;
  onFollowToggle: (userId: string) => void; // Callback for follow/unfollow action
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  handle,
  avatar,
  isFollowing,
  onFollowToggle,
}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.handle}>@{handle}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, isFollowing ? styles.followingButton : styles.followButton]}
        onPress={() => onFollowToggle(id)}
      >
        <Text style={isFollowing ? styles.followingButtonText : styles.followButtonText}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  handle: {
    color: '#657786',
    fontSize: 14,
  },
  followButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1DA1F2', // Twitter blue
  },
  followingButton: {
    backgroundColor: '#1DA1F2',
  },
  followButtonText: {
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default UserCard;