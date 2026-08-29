import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { updateMessageReadStatus } from "./models/messageModel";
import { AppError } from "./utils/appError";
import  jwt from "jsonwebtoken";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if(!token){
        throw new AppError("Socket authentication failed", 401);
      }
        const decoded=jwt.verify(token,process.env.SECRET_KEY as string);
        socket.data.user=decoded;
        next();
    } catch (err) {
      next(new AppError("Socket authentication failed", 401));
    }
  });
  io.on("connection", (socket: Socket) => {
    const userId=socket.data.user?.userId;
    socket.join(`user_${userId}`);
    console.log(`Securely connected: User ${userId} on socket ${socket.id}`);
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`chat_${conversationId}`);
      console.log(
        `Socket ${socket.id} joined conversation room: chat_${conversationId}`,
      );
      socket.on(
        "read_message",
        async (data: { conversationId: string; messageIds: string[] }) => {
          try {
            await updateMessageReadStatus(data.conversationId, data.messageIds);
            io.to(`chat_${data.conversationId}`).emit("messages_read_receipt", {
              messageIds: data.messageIds,
              conversationId: data.conversationId,
            });
          } catch (err) {
            return new AppError("Failed to update message read status", 500);
          }
        },
      );
    });
    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`chat_${conversationId}`);
      console.log(
        `Socket ${socket.id} left conversation room: chat_${conversationId}`,
      );
    });
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
    return io;
  });
};

export const getIo = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
