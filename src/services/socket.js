import { io } from "socket.io-client";

const API_BASE = "https://bismiserver.onrender.com";

let socket = null;

export function getSocket() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  if (!socket) {
    socket = io(API_BASE, {
      transports: ["websocket", "polling"],
      auth: { token },
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}