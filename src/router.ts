import express, { Express } from "express";
import calculationsRouter from "./routers/calculations";
const router = express.Router();

const chooseRoutes = (app: Express) => {
  app.use(calculationsRouter);
};

export default chooseRoutes;
