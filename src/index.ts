import express from 'express';
import connectDB from './config/db';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/chatRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = createServer(app);

const allowedOrigins = [process.env.BASE_URL];
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(cookieParser());

console.log('process.env.BASE_URL :', process.env.BASE_URL);
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data, callback) => {
    socket.join(data);

    if (callback) {
      callback(true); // Acknowledge the successful join
    }
  });

  socket.on("send_message", (data) => {
    const dataToSave = { message: data.encryptedMessage, addedUserId: data.addedUserId, messagedUserId: data.senderId };
    // addChatToDb(dataToSave);

    socket.to(data.roomId).emit("receive_message", data.message);
  });
});

connectDB();

app.use(express.json());

app.use('/codexServer', userRoutes);
// app.use('/admin-page', adminRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
