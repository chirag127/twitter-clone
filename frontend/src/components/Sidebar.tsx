import React from 'react';
import { Box, VStack, Text, Pressable, Icon, Button, HStack, Avatar } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// Removed useRoute and RouteProp imports
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/RootNavigator';

// Define navigation items
const navItems = [
  { name: 'Home', iconType: MaterialIcons, icon: 'home', screen: 'Feed' as keyof AppStackParamList },
  { name: 'Explore', iconType: MaterialIcons, icon: 'search', screen: 'Explore' as keyof AppStackParamList },
  { name: 'Notifications', iconType: MaterialIcons, icon: 'notifications-none', screen: 'Notifications' as keyof AppStackParamList },
  { name: 'Messages', iconType: MaterialIcons, icon: 'mail-outline', screen: 'Messages' as keyof AppStackParamList },
  { name: 'Grok', iconType: MaterialCommunityIcons, icon: 'rocket-launch-outline', screen: 'Grok' as keyof AppStackParamList },
  { name: 'Communities', iconType: MaterialIcons, icon: 'group', screen: 'Communities' as keyof AppStackParamList },
  { name: 'Premium', iconType: MaterialCommunityIcons, icon: 'twitter', screen: 'Premium' as keyof AppStackParamList },
  { name: 'Profile', iconType: MaterialIcons, icon: 'person-outline', screen: 'Profile' as keyof AppStackParamList },
  { name: 'More', iconType: MaterialIcons, icon: 'more-horiz', screen: 'More' as keyof AppStackParamList },
];

// Dummy user data
const dummyUser = {
    id: 'dummyUserId123',
    name: 'Roo Dev',
    handle: 'roodev',
    avatar: 'https://via.placeholder.com/150/771796'
};

type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;

const Sidebar = () => {
  const navigation = useNavigation<AppNavigationProp>();
  // Removed useRoute and activeScreen logic based on it

  const handleNavigate = (screen: keyof AppStackParamList | string, params?: any) => {
    // Simplified navigation logic, assuming screen is a valid key for now
    // Error handling for non-existent screens can be added later
    if (screen === 'Profile' && !params?.userId) {
        navigation.navigate('Profile', { userId: dummyUser.id });
    } else if (navItems.some(item => item.screen === screen)) {
        navigation.navigate(screen as keyof AppStackParamList, params);
    } else {
        console.log(`Screen "${screen}" not implemented or invalid.`);
    }
  };

  return (
    <VStack justifyContent="space-between" flex={1} p={2} bg="black" borderRightWidth={1} borderRightColor="gray.800">
        <VStack space={1}>
            <Pressable onPress={() => handleNavigate('Feed')} p={3} borderRadius="full" _hover={{bg: "gray.800"}} alignSelf="flex-start">
                 <Text fontSize="3xl" fontWeight="bold" color="white">X</Text>
            </Pressable>

            {navItems.map((item) => {
                // Temporarily remove active state styling logic
                // const isActive = activeScreen === item.screen;
                const isActive = false; // Placeholder - no active styling for now
                return (
                    <Pressable
                        key={item.name}
                        onPress={() => handleNavigate(item.screen)}
                        py={2}
                        px={3}
                        borderRadius="full"
                        _hover={{ bg: 'gray.800' }}
                        alignSelf="flex-start"
                    >
                    <HStack space={5} alignItems="center">
                        <Icon
                            as={item.iconType}
                            name={item.icon}
                            size={7}
                            color="white" // Keep icons white
                        />
                        <Text
                            fontSize="xl"
                            // fontWeight={isActive ? 'extrabold' : 'medium'} // Revert font weight change
                            fontWeight={'medium'}
                            color="white" // Keep text white
                        >
                            {item.name}
                        </Text>
                    </HStack>
                    </Pressable>
                );
            })}

            <Button
                bg="blue.500"
                borderRadius="full"
                py={3}
                mt={4}
                onPress={() => console.log("TODO: Open Tweet Composer")}
                _hover={{ bg: 'blue.600' }}
                _pressed={{ bg: 'blue.700' }}
            >
                <Text color="white" fontWeight="bold" fontSize="md">Post</Text>
            </Button>
        </VStack>

        <Pressable mt={4} p={2} borderRadius="full" _hover={{ bg: 'gray.800' }} onPress={() => console.log("TODO: Open Profile Popover/Logout")}>
             <HStack space={3} alignItems="center">
                <Avatar size="sm" source={{ uri: dummyUser.avatar }} />
                <VStack flex={1} mr={2}>
                    <Text fontWeight="bold" fontSize="sm" isTruncated noOfLines={1} color="white">{dummyUser.name}</Text>
                    <Text color="gray.500" fontSize="sm" isTruncated noOfLines={1}>@{dummyUser.handle}</Text>
                </VStack>
                <Icon as={MaterialIcons} name="more-horiz" size={5} color="white" />
             </HStack>
        </Pressable>
    </VStack>
  );
};

export default Sidebar;