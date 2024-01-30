import express, { Request, Response, Router } from "express";
import calculationsGet from "../controllers/calculations/getCalculations";
import addCalculations from "../controllers/calculations/addCalculations";
import getCalculations from "../controllers/calculations/getCalculations";

const calculationsRouter: Router = express.Router();
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
export default calculationsRouter;
