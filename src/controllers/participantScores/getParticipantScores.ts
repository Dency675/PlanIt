import { Request, Response } from "express";
import participantScores from "../../models/participantScores";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Retrieves participant scores for a specified team member.
 * @param req - Express Request object with query parameters.
 * @param res - Express Response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.

**/

const getParticipantScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teamMemberId = req.params.teamMemberId;

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
