// //server.ts
import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import sequelize from "./config/sequelize";
import { Sequelize, DataTypes, Model } from "sequelize";
import chooseRoutes from "./router";

// // const port = 3000 || process.env.port;

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
      socket.join(sessionId);

      io.to(sessionId).emit("roomCreated", {});
      console.log(`Room created`);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  });

  socket.on("joinRoom", (roomId: string, creator: string) => {
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
