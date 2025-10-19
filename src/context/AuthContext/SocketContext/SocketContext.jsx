import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
