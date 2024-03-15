import cors from "cors";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { sequelizeSync } from "./services/sequelize";
import chooseRoutes from "./router";
import socketConnection from "./helper/socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;

sequelizeSync();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

chooseRoutes(app);

socketConnection(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
