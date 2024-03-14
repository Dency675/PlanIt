import express, { Request, Response, Router } from "express";
import getCalculations from "../controllers/calculations/getCalculations";
import addCalculations from "../controllers/calculations/addCalculations";
import getAllCalculations from "../controllers/calculations/getAllCalculations";

const calculationsRouter: Router = express.Router();
//Routers for the calculations table
calculationsRouter.post(
  "/calculations",
  async (req: Request, res: Response) => {
    addCalculations(req, res);
  }
);
calculationsRouter.get(
  "/calculations/:id",
  async (req: Request, res: Response) => {
    getCalculations(req, res);
  }
);

calculationsRouter.get("/calculations", async (req: Request, res: Response) => {
  getAllCalculations(req, res);
});
export default calculationsRouter;
