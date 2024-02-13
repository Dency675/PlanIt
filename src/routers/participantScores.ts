import express from "express";
import { Request, Response } from "express";
import addParticipantScores from "../controllers/participantScores/addParticipantScores";
import getParticipantScores from "../controllers/participantScores/getParticipantScores";
import listOfParticipantsWithTheirScore from "../controllers/participantScores/listOfParticipantsWithTheirScore";

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

participantScoresRouter.get(
  "/listOfParticipantsWithTheirScore",
  async (req: Request, res: Response) => {
    listOfParticipantsWithTheirScore(req, res);
  }
);

export default participantScoresRouter;
