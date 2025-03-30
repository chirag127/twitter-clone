import React from 'react';
import { Box, HStack, ScrollView } from 'native-base'; // Removed VStack as it's not directly used here
import { useWindowDimensions } from 'react-native';

// Placeholder components
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { width } = useWindowDimensions();
  // Adjust breakpoint if needed based on visual preference
  const isLargeScreen = width > 1024; // Increased breakpoint for 3 columns

  return (
    // Use dark background and appropriate border colors
    <HStack flex={1} bg="black">
      {/* Sidebar - Fixed width, dark border */}
      {isLargeScreen && (
        <Box w="275px" borderRightWidth={1} borderRightColor="gray.700"> {/* Darker border */}
          <Sidebar />
        </Box>
      )}

      {/* Main Content Area - Flexible width, dark border */}
      {/* Max width helps center content like Twitter */}
      <ScrollView
        flex={1}
        maxW="600px"
        borderLeftWidth={isLargeScreen ? 1 : 0} // Add left border only if sidebar is present
        borderRightWidth={isLargeScreen ? 1 : 0} // Add right border only if right panel is present
        borderColor="gray.700" // Darker border
      >
        {children}
      </ScrollView>

      {/* Right Panel - Fixed width, dark border */}
      {isLargeScreen && (
        <Box w="350px" borderLeftWidth={1} borderLeftColor="gray.700" p={4}> {/* Darker border */}
           <RightPanel />
        </Box>
      )}

      {/* TODO: Add Bottom Navigation for smaller screens */}
    </HStack>
  );
};

export default MainLayout;