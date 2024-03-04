import express, { Request, Response, Router } from "express";
import { postScales } from "../controllers/scales/postScales";
import { getScalesByID } from "../controllers/scales/getScales";

const router: Router = express.Router();

router.post("/scales", async (req: Request, res: Response) => {
  postScales(req, res);
});

router.get("/scales/:estimationId", async (req: Request, res: Response) => {
  getScalesByID(req, res);
});

export default router;
