import express, { Request, Response, Router } from "express";
import calculationsGet from "../controllers/calculations/getCalculations";

import getCalculations from "../controllers/calculations/getCalculations";
import addCalculations from "../controllers/calculations/addCalculations";
import getAllCalculations from "../controllers/calculations/getAllCalculations";

const calculationsRouter: Router = express.Router();
//Routers for the calculations table
calculationsRouter.post(
  "/addCalculations",
  async (req: Request, res: Response) => {
    addCalculations(req, res);
  }
);
calculationsRouter.get(
  "/getCalculations",
  async (req: Request, res: Response) => {
    getCalculations(req, res);
  }
);

calculationsRouter.get(
  "/getAllCalculations",
  async (req: Request, res: Response) => {
    getAllCalculations(req, res);
  }
);
export default calculationsRouter;
