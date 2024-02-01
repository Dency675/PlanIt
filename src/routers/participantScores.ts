import express from "express";
import { Request, Response } from "express";
import addParticipantScores from "../controllers/participantScores/addParticipantScores";
import getParticipantScores from "../controllers/participantScores/getParticipantScores";

const participantScoresRouter = express.Router();

participantScoresRouter.post(
  "/addParticipantScores",
  async (req: Request, res: Response) => {
    addParticipantScores(req, res);
  }
);

participantScoresRouter.get(
  "/getParticipantScores",
  async (req: Request, res: Response) => {
    getParticipantScores(req, res);
  }
);

export default participantScoresRouter;
