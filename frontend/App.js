import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

// Screens
function HomeScreen() {
  return (
    <Container>
      <Tweet>
        <Avatar source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}} />
        <TweetContent>
          <Name>John Doe</Name>
          <Username>@johndoe</Username>
          <TweetText>Building a Twitter clone with React Native! #expo #reactnative</TweetText>
        </TweetContent>
      </Tweet>
    </Container>
  );
}

function SearchScreen() {
  return <Container><Title>Search</Title></Container>;
}

function NotificationsScreen() {
  return <Container><Title>Notifications</Title></Container>;
}

function MessagesScreen() {
  return <Container><Title>Messages</Title></Container>;
}

// Tab Navigator
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1DA1F2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
    </Tab.Navigator>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <MainTabs />
    </NavigationContainer>
  );
}

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 15px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

const Tweet = styled.View`
  flex-direction: row;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e6ecf0;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

const TweetContent = styled.View`
  flex: 1;
`;

const Name = styled.Text`
  font-weight: bold;
  font-size: 16px;
`;

const Username = styled.Text`
  color: #657786;
  font-size: 14px;
`;

const TweetText = styled.Text`
  font-size: 16px;
  margin-top: 5px;
`;
