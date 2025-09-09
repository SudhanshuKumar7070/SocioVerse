# SocioVerse

SocioVerse is a full-stack social media web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a comprehensive suite of social networking features—tweeting, friending, following, chatting, and reels—leveraging real-time technologies and scalable backend services.

## Features

- **Tweet Creation & Posting**: Share your thoughts and updates with your network.
- **Friend Requests**: Send and receive friend requests to connect with other users.
- **Follow/Unfollow**: Stay updated with people you care about by following or unfollowing them.
- **Private Chatting**: Enjoy secure, real-time messaging powered by Socket.io.
- **Notifications**: Get notified about friend requests, messages, and other activities.
- **Reels**: Create, upload, and share short video reels with your followers.
- **Reels Posting**: Browse, like, and interact with reels posted by users.
- **HLS Streaming**: Supports HTTP Live Streaming for media content, including reels.
- **Authentication**: Secure login and registration using bcrypt for password hashing.
- **Background Jobs**: Utilizes BullMQ and Redis for efficient job processing and queue management.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.io
- **Authentication**: bcrypt, jsonwebtoken (JWT)
- **Job Queue & Caching**: BullMQ, Redis
- **Media Streaming**: HLS

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Redis Server

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/SudhanshuKumar7070/SocioVerse.git
    cd SocioVerse
    ```

2. **Install dependencies**  
   Run `npm install` in the relevant directories (`Frontend/chatApp/`, `Backend/server/`, `videoServices/`) to install dependencies for each service.

3. **Configure Environment Variables**

    Create a `.env` file in the appropriate directories and add your configuration for MongoDB, Redis, and other secrets.

### Running the Application

- **Frontend**  
    ```bash
    cd Frontend/chatApp/
    npm run dev
    ```

- **Backend**  
    ```bash
    cd Backend/server/
    npm run dev
    ```

- **Video Services (Reels & Streaming)**  
    ```bash
    cd videoServices/
    npm start
    ```

## Usage

- Register and log in to your account.
- Create and post tweets.
- Send, accept, or decline friend requests.
- Follow or unfollow users.
- Start private chats with friends in real time.
- Create, upload, and view reels.

## Contributing

Contributions are welcome! Please open issues or pull requests for suggestions, bug reports, or improvements.

## License

This project is currently unlicensed. You may add a license in the future as needed.

## Contact

For questions or support, reach out via [GitHub Issues](https://github.com/SudhanshuKumar7070/SocioVerse/issues).
