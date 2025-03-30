import React from 'react';
import { Box, VStack, Text, Pressable, Icon, Button, HStack, Avatar } from 'native-base'; // Import Button, HStack, Avatar
import { MaterialIcons } from '@expo/vector-icons';
// TODO: Import navigation hook from react-navigation
// import { useNavigation } from '@react-navigation/native';

// Define navigation items
const navItems = [
  { name: 'Home', icon: 'home', screen: 'Feed' },
  { name: 'Explore', icon: 'search', screen: 'Explore' },
  { name: 'Notifications', icon: 'notifications-none', screen: 'Notifications' },
  { name: 'Messages', icon: 'mail-outline', screen: 'Messages' },
  { name: 'Profile', icon: 'person-outline', screen: 'Profile' },
  // Add more items like Lists, Bookmarks, More etc.
];

// Dummy user data - replace with actual logged-in user data from state/context
const dummyUser = {
    name: 'Roo Dev',
    handle: 'roodev',
    avatar: 'https://via.placeholder.com/150/771796'
};

const Sidebar = () => {
  // const navigation = useNavigation(); // Get navigation object

  // TODO: Determine active screen to highlight the correct nav item
  const activeScreen = 'Feed'; // Placeholder

  const handleNavigate = (screen: string, params?: any) => {
    console.log("Navigate to:", screen, params);
    // navigation.navigate(screen, params); // Actual navigation call
  };

  return (
    <VStack justifyContent="space-between" flex={1} p={3} borderRightWidth={1} borderRightColor="gray.200">
        {/* Top Section: Logo & Nav Items */}
        <VStack space={1}>
            {/* Twitter Logo Placeholder */}
            <Box mb={4} pl={2}>
                <Icon as={MaterialIcons} name="flutter-dash" size={8} color="blue.500" />
            </Box>

            {/* Navigation Items */}
            {navItems.map((item) => (
                <Pressable
                    key={item.name}
                    onPress={() => handleNavigate(item.screen, item.screen === 'Profile' ? { userId: dummyUser.handle } : undefined)} // Pass userId for Profile
                    p={3}
                    borderRadius="full"
                    _hover={{ bg: 'gray.100' }} // Hover effect
                >
                <HStack space={4} alignItems="center">
                    <Icon
                        as={MaterialIcons}
                        name={item.icon}
                        size={7} // Slightly larger icons
                        color={activeScreen === item.screen ? 'blue.500' : 'black'} // Highlight active
                    />
                    <Text
                        fontSize="xl"
                        fontWeight={activeScreen === item.screen ? 'bold' : 'normal'} // Bold if active
                        color={activeScreen === item.screen ? 'blue.500' : 'black'}
                    >
                        {item.name}
                    </Text>
                </HStack>
                </Pressable>
            ))}

            {/* Tweet Button */}
            <Button
                bg="blue.500"
                borderRadius="full"
                py={3}
                mt={4}
                onPress={() => console.log("Open Tweet Composer")}
                _hover={{ bg: 'blue.600' }}
            >
                <Text color="white" fontWeight="bold" fontSize="md">Tweet</Text>
            </Button>
        </VStack>

        {/* Bottom Section: User Profile Popover Trigger */}
        <Pressable mt={4} p={2} borderRadius="full" _hover={{ bg: 'gray.100' }}>
             <HStack space={3} alignItems="center">
                <Avatar size="sm" source={{ uri: dummyUser.avatar }} />
                <VStack flex={1}>
                    <Text fontWeight="bold" fontSize="sm" isTruncated>{dummyUser.name}</Text>
                    <Text color="gray.500" fontSize="sm" isTruncated>@{dummyUser.handle}</Text>
                </VStack>
                <Icon as={MaterialIcons} name="more-horiz" size={5} color="black" />
             </HStack>
        </Pressable>
    </VStack>
  );
};

export default Sidebar;