import React from 'react'
import { io } from "socket.io-client";

const BackendUrl = import.meta.env.VITE_API_URL;

const socket = io(BackendUrl, {
  transports: ["websocket"],
  upgrade: false,
});

export default socket
