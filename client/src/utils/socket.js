import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (url, userId) => {
  if (!socket) {
    socket = io(url, {
      query: { userId },
      autoConnect: false,
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
  }
};
