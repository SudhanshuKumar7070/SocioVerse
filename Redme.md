# 💬 SocioVerse – Realtime Social Media + Chat App

**SocioVerse** is a powerful full-stack MERN application that combines real-time **messaging**, **social interactions** (like tweets & reels), and **friendship system** in one unified experience. It’s designed with scalable architecture, real-time capabilities, and a modular codebase using modern web technologies.

---

## 🚀 Features

### 🧑‍🤝‍🧑 Social System
- User registration with bio, profile picture, banner
- Follow / Unfollow users
- Send & accept friend requests
- View suggested connections (People You May Know)

### 🟣 Real-time Chat
- 1-to-1 messaging system using `Socket.IO`
- Chat room creation on-demand
- Real-time message delivery with **notifications**
- Offline user message notification queue

### 🔔 Notification System
- Realtime notifications for:
  - New messages
  - Friend requests
  - Tweet comments
- Categorized notification feed
- Mark-as-read support

### 🐦 Tweet & Reel System (MVP)
- Post tweets (text)
- Upload reels (video clips)
- Comment on posts
- Like / Share

### 🛠️ Tech Stack

| Frontend | Backend | Realtime | Database | Others |
|----------|---------|----------|----------|--------|
| React.js | Node.js + Express | Socket.IO | MongoDB + Mongoose | Redux, Axios |
| Tailwind CSS | JWT Auth | Redis (for Pub/Sub) | Cloudinary (for media) | Nodemailer (optional) |

---

## 🔧 Project Structure

Frontend/
├── chatApp/
│   └── src/
│       ├── components/
│       ├── store/
│       ├── redux/
│       ├── App.jsx/
│       ├── index.js/
│       └── main.jsx/
│       └── serverConnection.jsx/
├── Backend/   
 └── controllers
 └── Models
 └── routes
 └──utils
 └── DataBase
 └──Middlewares
 └──public     
├── README.md          
├── package.json
├── .gitignore
└── node_modules/

---

## ⚙️ Getting Started

### 🚩 Prerequisites
- Node.js
- MongoDB Atlas / local
- Redis (if using pub-sub)
- Cloudinary (for file uploads)

### 🛠️ Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/socioversedemo.git

# 2. Install dependencies
cd server
npm install
cd ../client
npm install

# 3. Create .env files
# Refer to `.env.example` for all required variables

# 4. Start both
npm run dev
