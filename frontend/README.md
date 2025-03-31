# Twitter Clone Frontend

This is the frontend for a Twitter clone application, built with React Native and Expo.

## Features

-   User authentication (register, login, logout)
-   Tweet creation and viewing
-   Like/unlike tweets
-   Retweet/unretweet functionality
-   Follow/unfollow users
-   User profiles
-   Feed viewing
-   Search functionality for tweets and users

## Tech Stack

-   React Native
-   Expo
-   React Navigation
-   Zustand for state management
-   Axios for API requests
-   AsyncStorage for local storage

## Setup and Installation

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Update the API base URL in `utils/api.js` to point to your backend server address
4. Start the Expo development server:
    ```
    npm start
    ```
5. Use the Expo Go app on your device to scan the QR code, or run in a simulator/emulator

## App Structure

### Screens

-   `HomeScreen` - Displays the tweet feed
-   `ProfileScreen` - Shows user profiles and tweets
-   `SearchScreen` - Search for tweets and users
-   `NewTweetScreen` - Create new tweets
-   `TweetScreen` - View a single tweet with replies
-   Auth screens:
    -   `LoginScreen`
    -   `RegisterScreen`

### Navigation

-   `AuthNavigator` - Handles authentication screens
-   `MainNavigator` - Main app navigation after login

### Components

-   `Tweet` - Renders a tweet with like/retweet actions
-   `UserItem` - Renders a user with follow button
-   `Button` - Reusable button component
-   `Input` - Reusable input component

### Store

-   `authStore` - Manages authentication state
-   `tweetStore` - Manages tweets data and actions
-   `userStore` - Manages user data and actions

## API Integration

The app communicates with the backend API using Axios. All API requests include JWT authentication token in headers.

## State Management

The app uses Zustand for state management, which provides a simple yet powerful way to manage global state with hooks.

## Styling

The app follows Twitter's design language with a clean and modern UI using custom styling.

## License

This project is licensed under the MIT License.
