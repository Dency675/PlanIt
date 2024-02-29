import { Server, Socket } from "socket.io";
import * as handlers from "./socketEvents";

interface SocketHandlers {
  [eventName: string]: (...args: any[]) => Promise<void>;
}

const socketConnection = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");

    const socketHandlers: SocketHandlers = handlers;

    const handlerSocket = (eventName: keyof SocketHandlers, ...args: any[]) => {
      console.log("eventName", eventName);
      const handlerFunction = socketHandlers[eventName];
      if (handlerFunction) {
        handlerFunction(io, socket, ...args);
      } else {
        console.error(`No handler found for event: ${eventName}`);
      }
    };

    socket.on("createRoom", async (sessionId: string) => {
      handlerSocket("createRoom", sessionId);
    });

    socket.on("userStoryMappingId", (userStoryMappingId, sessionId) => {
      handlerSocket("userStorySelected", userStoryMappingId, sessionId);
    });

    socket.on("joinRoom", async (sessionId, userId) => {
      handlerSocket("joinRoom", sessionId, userId);
    });

    socket.on("timerSet", async (isTimerRunning, sessionId, currentTime) => {
      handlerSocket("timerSet", isTimerRunning, sessionId, currentTime);
    });

    socket.on("startVoting", async (sessionId, isStartButtonStarted) => {
      handlerSocket("startVoting", sessionId, isStartButtonStarted);
    });

    socket.on("revealClicked", async (sessionId, selectedUserStoryId) => {
      handlerSocket("revealClicked", sessionId, selectedUserStoryId);
    });

    socket.on("startButtonClicked", async (sessionId, count) => {
      handlerSocket("startButtonClicked", sessionId, count);
    });

    socket.on("resultSaved", async (sessionId) => {
      handlerSocket("resultSaved", sessionId);
    });

    socket.on("saveResultClicked", async (sessionId) => {
      handlerSocket("saveResultClicked", sessionId);
    });

    socket.on("userVoted", async (sessionId, teamMemberId, index) => {
      handlerSocket("userVoted", sessionId, teamMemberId, index);
    });

    socket.on("sessionParticipantsScore", async (sessionId, userData) => {
      handlerSocket("sessionParticipantsScore", sessionId, userData);
    });

    socket.on("sessionEnded", async (sessionId) => {
      handlerSocket("sessionEnded", sessionId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

export default socketConnection;
