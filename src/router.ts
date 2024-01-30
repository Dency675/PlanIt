import express, { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
import userStoriesRouter from "./routers/userStories";
const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
  app.use(userStoriesRouter);
};

export default chooseRoutes;

