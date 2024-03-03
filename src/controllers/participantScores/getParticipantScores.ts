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
      return failure(res, 404, null, "Bad Request");
    }

    const data = await participantScores.findOne({
      where: { teamMemberId },
      raw: true,
    });

    if (data) {
      return success(res, 200, data.storyPoint, "Found Participant Score");
    } else {
      return failure(res, 404, null, "Data not found");
    }
  } catch {
    (error: any) => {
      return failure(res, 500, null, error.toString);
    };
  }
};

export default getParticipantScores;
