import express, { Express } from "express";
import calculationsRouter from "./routers/calculations";
const router = express.Router();

const chooseRoutes = (app: Express) => {
//get and post of calculations
  app.use(calculationsRouter);
};

export default chooseRoutes;
