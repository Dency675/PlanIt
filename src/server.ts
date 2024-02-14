// //server.ts
import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import chooseRoutes from "./router";
import { sendEmailNotification } from "./controllers/email/send_mail";
import userInformation from "./models/userInformation";
import sessionParticipants from "./models/sessionParticipants";
import sessions from "./models/sessions";
interface User {
  name: string;
  email: string;
  teamName: string;
  storyName: string;
}

let users: User[] = [
  {
    name: "Jack",
    email: "geevarghese.varghese@experionglobal.com",
    teamName: "Agile Architects",
    storyName: "Stripe API",
  },
]; // // const port = 3000 || process.env.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};


app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

sequelizeSync();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

chooseRoutes(app);


io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("createRoom", async (sessionId: string) => {
    try {
      const planningparticipants = await sessionParticipants.findAll({
        where: { sessionId: sessionId },
        attributes: [],
        include: [
          {
            model: userInformation,
            as: "user",
            attributes: ["givenName", "email"],
          },
        ],
      });

      const session = await sessions.findOne({
        where: { id: sessionId },
        attributes: ["sessionTitle"],
      });

      const participantsInfo = planningparticipants.map((participant) => ({
        name: participant.user.givenName,
        email: participant.user.email,
        storyName: session?.sessionTitle,
      }));
      sendEmailNotification("planningPokerStarted", participantsInfo);
      socket.join(sessionId);

      io.emit("roomCreated", sessionId);
      console.log(`Room created`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  });

  socket.on("userStoryMappingId", (userStoryMappingId, sessionId) => {
    console.log(userStoryMappingId);
    console.log(typeof userStoryMappingId);
    console.log(sessionId);

    io.to(sessionId).emit("userStoryMappingIdDeveloper", {
      userStoryMappingId,
      sessionId,
    });
  });

  socket.on("joinRoom", async (sessionId, userId) => {
    try {
      
      socket.join(sessionId);
      io.to(sessionId).emit("userJoined", { sessionId });

      console.log(`User ${userId} joined room ${sessionId}`);
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });
  socket.on("timerSet", async (isTimerRunning, sessionId, currentTime) => {
    console.log("timerSet");
    console.log(isTimerRunning);
    console.log(sessionId);
    console.log(currentTime);
    socket.join(sessionId);
    io.to(sessionId).emit("timerShow", {
      isTimerRunning,
      sessionId,
      currentTime,
    });
  });

  socket.on("startVoting", async (sessionId, isStartButtonStarted) => {
    console.log("startVoting", sessionId, isStartButtonStarted);
    socket.join(sessionId);

    io.to(sessionId).emit("votingStarted", sessionId, isStartButtonStarted);
  });

  socket.on("revealClicked", async (sessionId, selectedUserStoryId) => {
    socket.join(sessionId);

    io.to(sessionId).emit("showResult", sessionId, selectedUserStoryId);
  });

  socket.on("startButtonClicked", async (sessionId) => {
    socket.join(sessionId);

    io.to(sessionId).emit("showParticipants", sessionId);
  });

  socket.on("userVoted", async (sessionId, teamMemberId) => {
    socket.join(sessionId);
    console.log("userVoted", sessionId, teamMemberId);

    io.to(sessionId).emit("userVotedAdded", sessionId, teamMemberId);
  });

  socket.on("sessionParticipantsScore", async (sessionId, userData) => {
    socket.join(sessionId);
    console.log("sessionParticipantsScore", sessionId, userData);

    io.to(sessionId).emit(
      "currentSessionParticipantsScore",
      sessionId,
      userData
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
