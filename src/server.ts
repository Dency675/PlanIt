// import express from "express";
// import { sequelizeSync } from "./services/sequelize";
// import sequelize from "./config/sequelize";
// import chooseRoutes from "./router";

import cors from "cors";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import sequelize from "./config/sequelize";
import chooseRoutes from "./router";

// const app = express();
// const port = 3000 || process.env.port;

const app = express();
const server = http.createServer(app);
const io = new Server(server).listen(3001);

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

sequelizeSync();

io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("createRoom", (creator) => {
    const roomId = generateRoomId();

    console.log(creator);

    const currentTime = new Date().toLocaleTimeString();
    socket.join(roomId);
    io.to(roomId).emit("roomCreated", { roomId, currentTime, creator });
  });

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

function generateRoomId(): string {
  return Math.random().toString(36).substring(7);
}

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

chooseRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
