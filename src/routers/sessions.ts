import express from "express";
import { Request, Response } from "express";
import addSessions from "../controllers/sessions/addSessions";
import getSessionById from "../controllers/sessions/getSessionById";
import editSessions from "../controllers/sessions/editSessions";

const router = express.Router();

router.post("/addSessions", (req: Request, res: Response) => {
  addSessions(req, res);
});
router.get("/getSessionById", (req: Request, res: Response) => {
  getSessionById(req, res);
});
router.patch("/editSessions", (req: Request, res: Response) => {
  editSessions(req, res);
});

export default router;
