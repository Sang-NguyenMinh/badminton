import {
  EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_ROOT_API_URL,
} from "@/configs/config";
import io, { Socket } from "socket.io-client";
import { getDataSecure } from "../libs/storage";
import { IMessageParams } from "./messagesAPIs";

const SOCKET_URL = `https://a38c-116-110-41-211.ngrok-free.app/socket`;

let socket: Socket;

export const initSocket = async () => {
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  return socket;
};

export const joinConversation = (
  socket: Socket,
  userId: string | number | undefined,
  conversationId: string
) => {
  if (socket) {
    console.log(`Joining conversation ${conversationId} for user ${userId}`);
    socket.emit("join", { userId, conversationId });
  }
};

export const leaveConversation = (
  socket: Socket,
  userId: string | number | undefined,
  conversationId: string
) => {
  if (socket) {
    console.log(`Leaving conversation ${conversationId} for user ${userId}`);
    socket.emit("leave", { userId, conversationId });
  }
};

export const sendMessageSocket = (
  socket: Socket | undefined,
  message: {
    conversationId: string;
    content: string;
    senderId: string | number | undefined;
    messageType: string;
    _id: string;
  }
) => {
  if (socket) {
    socket.emit("sendMessage", message);
  }
};
