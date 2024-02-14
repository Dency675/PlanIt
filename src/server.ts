// //server.ts
import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import sequelize from "./config/sequelize";
import { Sequelize, DataTypes, Model } from "sequelize";
import chooseRoutes from "./router";
import getSessionById from "./controllers/sessions/getSessionById";
import { sendEmailNotification } from "./controllers/email/send_mail";
import userInformation from "./models/userInformation";
import SessionParticipants from "./models/sessionParticipants";
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
    storyName: "Stripe API"
  },

];// // const port = 3000 || process.env.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
// const corsOptions = {
//   origin: "http://localhost:3000", // Allow requests only from this origin
//   methods: ["GET", "POST"], // Allow only specified methods
//   allowedHeaders: ["Authorization", "Content-Type", "Referer"], // Allow only specified headers
//   credentials: true, // Allow credentials
//   optionsSuccessStatus: 200, // Return a successful status code for preflight requests
// };

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

sequelizeSync();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());



chooseRoutes(app);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("createRoom", async (sessionId: string) => {
    try {
      
      // const participants = await SessionParticipants.findAll({
      //   where: { sessionId: sessionId },
      //   include: [{
      //     model: userInformation,
      //     attributes: ['givenName', 'email'],
      //   }],
      // });
  
      // // Find the session title
      // const session = await sessions.findOne({
      //   where: { id: sessionId },
      //   attributes: ['sessionTitle'],
      // });

      // const participantsInfo = participants.map(participant => ({
      //   given_name: participant.userInformation.givenName,
      //   email: participant.userInformation.email,
      //   session_title: session?.sessionTitle,
      // }));
      // console.log(participantsInfo);
  
      // sendEmailNotification("scheduledPlanningSession",users)
      socket.join(sessionId);

      // io.to(sessionId).emit("roomCreated", {});
      io.emit("roomCreated", sessionId);
      console.log(`Room created`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  });

  // socket.join(sessionId);
  socket.on("userStoryMappingId", (userStoryMappingId, sessionId) => {
    console.log(userStoryMappingId);
    console.log(typeof userStoryMappingId);
    console.log(sessionId);

    // io.to(sessionId).emit("userStoryMappingIdDeveloper", {
    //   userStoryMappingId,
    // });

    // io.to(sessionId).emit("userStoryMappingIdDeveloper", {
    //   userStoryMappingId,
    //   sessionId,
    // });

    // io.to(roomId).emit("roomCreated", { roomId, currentTime, creator });

    // io.emit("userStoryMappingIdDeveloper", userStoryMappingId, sessionId);
    io.emit("userStoryMappingIdDeveloper", { userStoryMappingId, sessionId });
    // socket.emit("userStoryMappingIdDeveloper", userStoryMappingId, sessionId);
  });

  socket.on("joinRoom", async (sessionId, userId) => {
    // socket.to(sessionId).emit("userJoined", { sessionId });
    try {
      // const req: any = {
      //   query: { sessionId },
      // };

      // const res: any = {
      //   json: (data: any) => {
      //     console.log("join room details", data);
      //   },
      // };

      // await getSessionById(req, res);

      socket.join(sessionId);
      io.to(sessionId).emit("userJoined", { sessionId });

      // socket.to(sessionId).emit("userJoined", { sessionId });

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

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
