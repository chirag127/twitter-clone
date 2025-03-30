import React from 'react';
import { Box, HStack, VStack, ScrollView } from 'native-base';
import { useWindowDimensions } from 'react-native';

// Placeholder components - we'll create these next
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface MainLayoutProps {
  children: React.ReactNode; // This will be the main content (e.g., FeedScreen, ProfileScreen)
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768; // Example breakpoint for showing 3 columns

  return (
    <HStack flex={1} bg="white">
      {/* Sidebar - Fixed width */}
      {isLargeScreen && (
        <Box w="275px" borderRightWidth={1} borderRightColor="gray.200">
          <Sidebar />
        </Box>
      )}

      {/* Main Content Area - Flexible width */}
      <ScrollView flex={1} maxW="600px" /* Center column max width like Twitter */ >
        {children}
      </ScrollView>

      {/* Right Panel - Fixed width */}
      {isLargeScreen && (
        <Box w="350px" borderLeftWidth={1} borderLeftColor="gray.200" p={4}>
           <RightPanel />
        </Box>
      )}

      {/* TODO: Add Bottom Navigation for smaller screens */}
    </HStack>
  );
};

export default MainLayout;