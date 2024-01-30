import express, { Express } from "express";
import userStoriesRouter from "./routers/userStories";
const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(userStoriesRouter);
};

export default chooseRoutes;
