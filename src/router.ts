import express, { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
import userStoriesRouter from "./routers/userStories";
import noteInformationRouter from "./routers/noteInformation";

const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
  app.use(userStoriesRouter);
  app.use(noteInformationRouter);
};

export default chooseRoutes;
