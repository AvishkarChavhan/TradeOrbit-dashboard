import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  transports: ["websocket"],
});

export function joinUserRoom() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    socket.emit("joinUserRoom", userId);
  }
}

socket.on("connect", () => {
  joinUserRoom();
});

export default socket;