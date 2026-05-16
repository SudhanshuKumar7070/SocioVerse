<p align="center">
  <img src="./Frontend/chatApp/src/components/DashBoard/logo for social media web app.png" alt="SocioVerse Logo" width="120" />
</p>

<h1 align="center">SocioVerse</h1>

<p align="center">
  <strong>A production-grade social media platform built with microservice architecture</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white" alt="FFmpeg" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<br />

SocioVerse is a full-stack social media platform that goes beyond basic CRUD. It features **real-time messaging**, **video reels with HLS streaming**, **background job processing with Dead Letter Queues**, and a **multi-channel notification system** — built as a distributed multi-service architecture.

---

## ✨ Key Highlights

<table>
  <tr>
    <td width="50%">
      <h3>🎬 Video Transcoding Pipeline</h3>
      <p>Raw video uploads are transcoded to <strong>HLS (HTTP Live Streaming)</strong> format using FFmpeg, processed via BullMQ workers, and streamed from Supabase Storage — a production-grade media pipeline.</p>
    </td>
    <td width="50%">
      <h3>⚡ Real-Time Architecture</h3>
      <p>Socket.io with <strong>namespace isolation</strong> (global + chat) and room-based messaging powers live chat, instant notifications, and real-time friend request updates.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>📬 Multi-Channel Notifications</h3>
      <p>Three parallel notification channels: <strong>In-app</strong> (Socket.io), <strong>Push</strong> (Firebase Cloud Messaging), and <strong>Email</strong> (Nodemailer) — each processed by dedicated BullMQ workers with retry and DLQ support.</p>
    </td>
    <td>
      <h3>🏗️ Microservice Architecture</h3>
      <p>Separated into <strong>3 independent services</strong> — Core API, Video Transcoding Service, and React SPA — each with its own dependencies, configuration, and scaling boundaries.</p>
    </td>
  </tr>
</table>

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React SPA)                        │
│          Vite · React 18 · Redux Toolkit · Tailwind CSS            │
│         Socket.io Client · Firebase Messaging · Video.js           │
└────────┬──────────────────┬───────────────────────┬────────────────┘
         │  REST API         │  WebSocket             │  FCM
         ▼                   ▼                        ▼
┌────────────────────────────────────────┐   ┌──────────────────────┐
│         BACKEND SERVICE (:3000)        │   │ VIDEO SERVICE (:3002) │
│                                        │   │                      │
│  Express.js · JWT Auth · Rate Limiter  │   │  Express.js · Multer │
│  9 Route Modules · 14 Mongoose Models  │   │  FFmpeg Transcoder   │
│                                        │   │  BullMQ Video Queue  │
│  ┌──────────────────────────────────┐  │   │  DLQ (Dead Letter)   │
│  │     BullMQ Workers               │  │   │                      │
│  │  ├─ In-App Notification Worker   │  │   └──────────┬───────────┘
│  │  ├─ Push Notification Worker     │  │              │
│  │  └─ Email Worker                 │  │              │
│  └──────────────────────────────────┘  │              │
└──────┬─────────┬───────────────────────┘              │
       │         │                                      │
       ▼         ▼                                      ▼
┌──────────┐ ┌─────────┐ ┌────────────┐ ┌──────────────────────────┐
│ MongoDB  │ │  Redis   │ │ Cloudinary │ │     Supabase Storage     │
│ 14 Models│ │  Cache   │ │   Images   │ │  HLS Segments (.m3u8)   │
│          │ │  Queues  │ │   Videos   │ │  Video Chunks (.ts)      │
└──────────┘ └─────────┘ └────────────┘ └──────────────────────────┘
```

---

## 📋 Features

### Social Networking
| Feature | Description |
|---------|-------------|
| **Tweets** | Create, edit, delete tweets with text, images, and video attachments |
| **Feed** | Paginated tweet feed with like counts and `isLikedByUser` computed fields via MongoDB aggregation |
| **Likes & Comments** | Interactive like/unlike toggle and threaded comments on tweets |
| **Follow / Unfollow** | Public follow system with follower/following counts and privacy support |
| **Friend Requests** | Full lifecycle — send, accept, reject — with real-time Socket.io notifications |
| **User Profiles** | Bio, banner image, social links, location, date of birth, and profile themes |

### Messaging & Notifications
| Feature | Description |
|---------|-------------|
| **Real-Time Chat** | Private 1-on-1 messaging using Socket.io rooms with conversation history |
| **In-App Notifications** | Instant socket-based alerts for friend requests, follows, comments, and messages |
| **Push Notifications** | Firebase Cloud Messaging (FCM) for background/cross-device notifications |
| **Email Notifications** | Password reset emails with styled HTML templates via Nodemailer |

### Video & Media
| Feature | Description |
|---------|-------------|
| **Reels Upload** | Upload short video reels with title and description |
| **HLS Transcoding** | FFmpeg converts raw uploads → `.m3u8` playlists + `.ts` segments |
| **Cloud Streaming** | Transcoded HLS segments uploaded to Supabase and streamed via Video.js |
| **Infinite Scroll** | IntersectionObserver-based infinite scroll for seamless reel browsing |
| **Image Uploads** | Profile pictures, tweet images, and banners stored on Cloudinary |

### Backend Infrastructure
| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Access + Refresh token pair with cookie-based session management |
| **Password Reset** | Email-based OTP flow — send code → verify → reset |
| **BullMQ Job Queues** | Dedicated queues for notifications, push, email, and video transcoding |
| **Dead Letter Queues** | Failed jobs (after 5 retries with exponential backoff) are captured in DLQs for debugging |
| **Redis Rate Limiting** | Custom sliding-window rate limiter using Redis hash sets |
| **Internationalization** | i18next integration for multi-language frontend support |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks and functional components |
| Vite | Build tool and dev server |
| Redux Toolkit | Global state management with `redux-persist` for session persistence |
| Tailwind CSS | Utility-first styling |
| Socket.io Client | Real-time bidirectional communication |
| Video.js | HLS video playback |
| Framer Motion | UI animations |
| React Hook Form | Form handling and validation |
| Lucide React | Icon system |
| React Router v7 | Client-side routing |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database with 14 data models and aggregation pipelines |
| Socket.io | WebSocket server with namespace isolation |
| BullMQ | Distributed job queue system |
| Redis (ioredis) | Queue broker, caching, and rate limiting |
| JWT (jsonwebtoken) | Stateless authentication |
| bcrypt | Password hashing |
| Firebase Admin SDK | Push notification delivery |
| Cloudinary | Image upload and transformation |
| Nodemailer | Transactional email delivery |
| Multer | Multipart file upload handling |

### Video Microservice
| Technology | Purpose |
|------------|---------|
| FFmpeg (fluent-ffmpeg) | Video transcoding to HLS format |
| Supabase Storage | Cloud storage for HLS segments and playlists |
| BullMQ | Video processing job queue with DLQ |

---

## 📁 Project Structure

```
SocioVerse/
├── Backend/                        # Core API service (port 3000)
│   ├── Config/
│   │   ├── FirebaseAdmin.config.js # FCM push notification sender
│   │   ├── Queue.config.js         # BullMQ queue definitions
│   │   ├── DLQ.config.js           # Dead Letter Queue setup
│   │   └── Notification/
│   │       ├── inAppNotification.config.js   # Socket.io notification worker
│   │       ├── PushNotification.config.js    # FCM push worker
│   │       └── Email.config.js               # Email worker
│   ├── Controllers/                # 10 controller modules
│   │   ├── user.controllers.js     # Auth, profile, bio, password reset
│   │   ├── tweet.controller.js     # CRUD + feed with aggregation
│   │   ├── friendRequest.controller.js # Send/accept/reject + notifications
│   │   ├── follower.controller.js  # Follow/unfollow system
│   │   ├── comment.controllers.js  # Comment CRUD
│   │   ├── like.controller.js      # Like/unlike toggle
│   │   ├── notification.controller.js  # Notification queries
│   │   └── conversation.controllers.js # Chat conversation management
│   ├── Models/                     # 14 Mongoose schemas
│   ├── Routes/                     # 9 route modules with JWT protection
│   ├── Middlewares/
│   │   ├── verifyJwt.js            # JWT authentication guard
│   │   ├── ratelimiter.js          # Redis-backed rate limiter
│   │   └── multer.middlewares.js   # File upload config
│   ├── Utils/                      # ApiError, ApiResponse, AsyncHandler
│   └── server/
│       ├── app.js                  # Express app setup + route mounting
│       ├── server.js               # HTTP server + Socket.io (global + chat)
│       ├── io.js                   # Socket.io instance factory
│       ├── globalNameSpace.js      # Global notification namespace
│       └── redis.server.js         # Redis client setup
│
├── VideoServices/                  # Video transcoding microservice (port 3002)
│   ├── Config/
│   │   ├── queue.setup.js          # FFmpeg worker + Supabase upload pipeline
│   │   ├── supabase.setup.js       # Supabase Storage client
│   │   └── DLQ.setup.js            # Video transcoding DLQ
│   ├── controller/
│   │   ├── videoUpload.controller.js   # Upload + enqueue transcoding job
│   │   └── video.likes.controller.js   # Video like/dislike system
│   ├── Routes/                     # Video upload, fetch, and like routes
│   └── Db/                         # Video-specific Mongoose schemas
│
└── Frontend/chatApp/               # React SPA (port 5173)
    ├── src/
    │   ├── components/
    │   │   ├── DashBoard/          # Main dashboard, navbar, sidebar, post creation
    │   │   ├── Reels/              # Video reels feed + upload + HLS player
    │   │   ├── Tweets/             # Tweet cards with like/comment UI
    │   │   ├── ChatSpacing/        # Chat interface and conversation list
    │   │   ├── MainTextingArea/    # Message input + display
    │   │   ├── Friends/            # Friend request management
    │   │   ├── Notifications/      # Notification center
    │   │   ├── Users/              # User profiles and search
    │   │   ├── ForgotPassword/     # Password reset flow
    │   │   └── LandingPage/        # Public landing page
    │   ├── store/                  # Redux slices (auth, token, conversation, etc.)
    │   ├── Config/                 # Firebase, user agent detection
    │   └── Hooks/                  # Custom hooks (toast, i18n)
    └── public/                     # Static assets + service worker
```

---

## 🔌 API Overview

The backend exposes **9 RESTful route modules**, all versioned under `/api/v1/`:

| Endpoint Prefix | Module | Key Operations |
|-----------------|--------|----------------|
| `/api/v1/auth` | Authentication | Register, Login, Logout, Refresh Token |
| `/api/v1/user` | User Management | Profile, Bio, Contacts, Password Reset, FCM Token |
| `/api/v1/tweet` | Tweets | Create, Edit, Delete, Feed (paginated), User Tweets |
| `/api/v1/comment` | Comments | Add, Delete, Get Comments by Tweet |
| `/api/v1/like` | Likes | Toggle Like/Unlike on Tweets |
| `/api/v1/follow` | Follow System | Follow, Unfollow, Get Followers/Followings |
| `/api/v1/friend_request` | Friends | Send, Accept, Reject, List Pending Requests |
| `/api/v1/notification` | Notifications | Fetch User Notifications |
| `/api/v1/conversation` | Chat | Create/Get Conversations |

**Video Service** (port 3002):

| Endpoint | Operation |
|----------|-----------|
| `POST /api/v1/video/upload` | Upload video + enqueue HLS transcoding |
| `GET /api/v1/video/fetch` | Paginated reel feed |
| `POST /api/v1/video/like` | Like/Dislike a reel |

---

## 🚀 Getting Started

### Prerequisites

| Dependency | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime |
| MongoDB | v6+ | Database |
| Redis | v7+ | Queue broker + caching |
| FFmpeg | v5+ | Video transcoding |

### 1. Clone the repository

```bash
git clone https://github.com/SudhanshuKumar7070/SocioVerse.git
cd SocioVerse
```

### 2. Configure environment variables

Create `.env` files in **Backend/**, **Backend/server/**, and **VideoServices/**:

**Backend/.env**
```env
MONGO_URI=mongodb://localhost:27017/socioverse
DataBase_Secret_Acess_key=your_jwt_access_secret
DataBase_Secret_Refresh_key=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**VideoServices/.env**
```env
MONGO_URI=mongodb://localhost:27017/socioverse
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install dependencies

```bash
# Backend
cd Backend && npm install
cd server && npm install && cd ../..

# Video Service
cd VideoServices && npm install && cd ..

# Frontend
cd Frontend/chatApp && npm install && cd ../..
```

### 4. Start all services

Open **3 separate terminals**:

```bash
# Terminal 1 — Backend API
cd Backend/server
npm run dev                # Starts on port 3000

# Terminal 2 — Video Transcoding Service
cd VideoServices
npm start                  # Starts on port 3002

# Terminal 3 — Frontend
cd Frontend/chatApp
npm run dev                # Starts on port 5173
```

> **Note:** Ensure MongoDB and Redis are running locally before starting the services.

---

## 📊 Data Models

The application uses **14 Mongoose schemas** covering the full social media domain:

```
User ─────────── Tweet ─────────── Comment
  │                 │                  │
  ├── Follower      ├── Like           │
  ├── Friend        │                  │
  ├── FriendRequest │                  │
  ├── Conversation ── Message         │
  │                    │               │
  ├── FCMToken         ├── MessageStatus
  │                    │
  └── Notification ────┘
  
  ReelVideo (VideoServices)
  Group (planned)
```

---

## 🔧 Background Job Processing

SocioVerse uses **BullMQ** with **Redis** as the message broker for reliable asynchronous job processing:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Producer        │     │   BullMQ Queue    │     │   Worker        │
│  (Controller)    │────▶│   (Redis-backed)  │────▶│   (Processor)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                            ┌─────────────▼─────────────┐
                                            │  On Failure (5 retries)   │
                                            │  Exponential Backoff      │
                                            │  ──────────────────────── │
                                            │  Move to Dead Letter      │
                                            │  Queue (DLQ) for debug    │
                                            └───────────────────────────┘
```

**Active Queues:**

| Queue | Worker | Purpose |
|-------|--------|---------|
| `inAppNotificationQueue` | `inAppNotificationWorker` | Create DB notification + emit Socket.io event |
| `pushNotificationQueue` | `PushNotificationWorker` | Look up FCM tokens + send via Firebase Admin SDK |
| `sendEmailQueue` | *(planned)* | Transactional email delivery |
| `videoQueue` | `videoTranscoder` | FFmpeg HLS transcoding + Supabase upload |

---

## 🎬 Video Transcoding Pipeline

The most complex subsystem — a multi-step async pipeline:

```
User uploads video
        │
        ▼
┌───────────────────┐
│  Multer receives   │
│  raw video file    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  BullMQ enqueues   │
│  transcoding job   │
└────────┬──────────┘
         │
         ▼
┌───────────────────────────────┐
│  FFmpeg Worker                 │
│  ┌───────────────────────┐    │
│  │ Input: raw video      │    │
│  │ Output:               │    │
│  │  ├── index.m3u8       │    │
│  │  ├── segment000.ts    │    │
│  │  ├── segment001.ts    │    │
│  │  └── segment00N.ts    │    │
│  └───────────────────────┘    │
└────────┬──────────────────────┘
         │
         ▼
┌───────────────────┐     ┌───────────────────┐
│  Upload .ts + .m3u8│────▶│  Supabase Storage  │
│  to cloud storage  │     │  (Public bucket)   │
└────────┬──────────┘     └───────────────────┘
         │
         ▼
┌───────────────────┐
│  Save public URL   │
│  to MongoDB        │
│  (ReelVideo model) │
└───────────────────┘
         │
         ▼
   Frontend streams
   via Video.js HLS
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📫 Contact

**Sudhanshu Kumar**

- GitHub: [@SudhanshuKumar7070](https://github.com/SudhanshuKumar7070)
- Project Link: [https://github.com/SudhanshuKumar7070/SocioVerse](https://github.com/SudhanshuKumar7070/SocioVerse)

---

<p align="center">
  <sub>Built with ❤️ by Sudhanshu Kumar</sub>
</p>
