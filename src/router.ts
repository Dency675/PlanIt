import express, { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
};

export default chooseRoutes;