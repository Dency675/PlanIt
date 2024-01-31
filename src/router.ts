import express, { Express } from "express";
import teamInformationRouter from "./routers/teamInformation";
import userStoriesRouter from "./routers/userStories";
import noteInformationRouter from "./routers/noteInformation";
import estimationRouter from "./routers/estimationsRouter";
import scaleRouter from "./routers/scalesRouter";
import calculationsRouter from "./routers/calculations";
import roleRouter from "./routers/roles";

const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(teamInformationRouter);
  app.use(userStoriesRouter);
  app.use(noteInformationRouter);
  app.use(estimationRouter);
  app.use(scaleRouter);
  app.use(calculationsRouter);
  app.use(roleRouter);
};

export default chooseRoutes;
