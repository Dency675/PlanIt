import { Request, Response } from "express";
import participantScores from "../../models/participantScores";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the addition of participant scores table.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */

const addParticipantScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamMemberId, userStorySessionMappingId, storyPoint } = req.body;

    if (teamMemberId && userStorySessionMappingId && storyPoint == undefined) {
      return failure(res, 400, null, "Bad Request - Missing required fields");
    }

    let data = await participantScores.findOne({
      where: {
        teamMemberId,
        userStorySessionMappingId,
      },
    });

    if (data) {
      await participantScores.update(
        { storyPoint },
        {
          where: {
            teamMemberId,
            userStorySessionMappingId,
          },
        }
      );

      data = await participantScores.findOne({
        where: {
          teamMemberId,
          userStorySessionMappingId,
        },
      });
      return success(res, 200, data, "Data modified successfully");
    } else {
      data = await participantScores.create(
        {
          teamMemberId,
          userStorySessionMappingId,
          storyPoint,
        },
        { raw: true }
      );

      return success(res, 201, data, "Data inserted successfully");
    }
  } catch (error: any) {
    console.error("Error adding participant scores:", error);

    let errorMessage = "Internal Server Error";

    if (error.name === "SequelizeValidationError") {
      errorMessage =
        "Validation Error: " +
        error.errors.map((e: any) => e.message).join(", ");
      return failure(res, 400, null, errorMessage);
    } else {
      return failure(res, 500, null, errorMessage);
    }
  }
};

export default addParticipantScores;
