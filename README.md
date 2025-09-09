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
- **Authentication**: Secure login and registration using bcrypt for password hashing and JWT for authorization.
- **Background Jobs**: Utilizes BullMQ and Redis for efficient job processing and queue management.
- **Media Management**: Store and serve media files using Cloudinary.
- **Email Services**: Send notifications and emails using Nodemailer.

## Tech Stack

- **Frontend:** React.js, Redux, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** bcrypt, JWT (jsonwebtoken)
- **State Management:** Redux
- **API Requests:** Axios
- **Real-Time Communication:** Socket.io
- **Job Queue & Caching:** BullMQ, Redis
- **Media Storage & Streaming:** Cloudinary,SupaBase, HLS
- **Email Service:** Nodemailer

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

    Create a `.env` file in the appropriate directories and add your configuration for MongoDB, Redis, Cloudinary, JWT secrets, email credentials, and other necessary values.

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
- Receive notifications and emails about activities.

## Contributing

Contributions are welcome! Please open issues or pull requests for suggestions, bug reports, or improvements.

## License

This project is currently unlicensed. You may add a license in the future as needed.

## Contact

For questions or support, reach out via [GitHub Issues](https://github.com/SudhanshuKumar7070/SocioVerse/issues).
