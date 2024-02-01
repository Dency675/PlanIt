import { Request, Response } from "express";
import participantScores from "../../models/participantScores";

const getParticipantScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamMemberId } = req.query;
    if (!teamMemberId) {
      res.send(404).json({ error: "Bad Request" });
    }

    const data = await participantScores.findOne({
      where: { teamMemberId },
      raw: true,
    });
    res.status(500).json(data?.storyPoint);
  } catch {
    (error: any) => {
      res.status(500).json({ error: error.toString() });
    };
  }
};

export default getParticipantScores;
