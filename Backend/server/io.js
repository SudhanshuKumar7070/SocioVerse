import { Server } from "socket.io";

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://socio-verse-mine.vercel.app",
].filter(Boolean);

let io;
const initiliseIo = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });
  return io;
};

const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
};

export { initiliseIo, getIo };