import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/chatRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  saveDirectMessage,
  saveGroupMessage,
} from "./utils/messagePersistence";

dotenv.config();

const app = express();
const server = createServer(app);

const allowedOrigins = [process.env.BASE_URL];
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(cookieParser());

console.log("process.env.BASE_URL :", process.env.BASE_URL);
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  socket.on("join_room", (data, callback) => {
    socket.join(data);

    if (callback) {
      callback(true); // Acknowledge the successful join
    }
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  socket.on("send_message", async (data) => {
    const { roomId, chatType, message, senderId } = data;

    try {
      const messageObj = { message, userId: senderId };
      const savedMessage =
        chatType === "group"
          ? await saveGroupMessage(roomId, messageObj)
          : await saveDirectMessage(roomId, messageObj);

      io.to(roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.error("Error during send_message:", error);
      socket.emit("message_error", { message: "Could not send message" });
    }
  });
});

connectDB();

app.use(express.json());

app.use("/codexServer", userRoutes);
// app.use('/admin-page', adminRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
