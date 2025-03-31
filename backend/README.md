# Twitter Clone Backend

This is the backend API for a Twitter clone application, built with Node.js, Express, and MongoDB.

## Features

-   User authentication (register, login, get current user)
-   Tweet CRUD operations
-   Like/unlike tweets
-   Retweet/unretweet functionality
-   Follow/unfollow users
-   User profiles
-   Feed generation
-   Search functionality

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB with Mongoose
-   JWT for authentication
-   bcrypt for password hashing

## Setup and Installation

1. Clone the repository
2. Install dependencies:
    ```
    npm install
    ```
3. Create a `config.env` file in the `config` folder with the following variables:
    ```
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=30d
    ```
4. Start the development server:
    ```
    npm run dev
    ```

## API Endpoints

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login user
-   `GET /api/auth/me` - Get current user

### Tweets

-   `POST /api/tweets` - Create a tweet
-   `GET /api/tweets/feed` - Get feed tweets
-   `GET /api/tweets/:id` - Get tweet by ID
-   `DELETE /api/tweets/:id` - Delete tweet
-   `PUT /api/tweets/:id/like` - Like/unlike tweet
-   `PUT /api/tweets/:id/retweet` - Retweet/unretweet tweet
-   `GET /api/tweets/user/:userId` - Get tweets by user
-   `GET /api/tweets/search` - Search tweets

### Users

-   `GET /api/users` - Get all users (with optional search)
-   `GET /api/users/:id` - Get user profile
-   `PUT /api/users/profile` - Update user profile
-   `PUT /api/users/:id/follow` - Follow/unfollow user
-   `GET /api/users/:id/followers` - Get user followers
-   `GET /api/users/:id/following` - Get user following

## Error Handling

The API implements robust error handling with appropriate status codes and error messages.

## Data Models

### User

-   `username` - String, required, unique
-   `email` - String, required, unique
-   `password` - String, required, hashed
-   `name` - String, required
-   `bio` - String
-   `profileImage` - String
-   `following` - Array of User IDs
-   `followers` - Array of User IDs

### Tweet

-   `content` - String, required
-   `user` - Reference to User
-   `likes` - Array of User IDs
-   `retweetedBy` - Array of User IDs
-   `retweetData` - Reference to Tweet
-   `replyTo` - Reference to Tweet

## License

This project is licensed under the MIT License.
