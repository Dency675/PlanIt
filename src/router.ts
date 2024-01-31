import express, { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
import userStoriesRouter from "./routers/userStories";
import noteInformationRouter from "./routers/noteInformation";
import estimationRouter from "./routers/estimationsRouter";
import scaleRouter from "./routers/scalesRouter";

const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
  app.use(userStoriesRouter);
  app.use(noteInformationRouter);
  app.use(estimationRouter)
  app.use(scaleRouter)
};

export default chooseRoutes;
