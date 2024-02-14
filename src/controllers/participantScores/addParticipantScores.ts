import { Request, Response } from "express";
import participantScores from "../../models/participantScores";

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
    console.log(teamMemberId);
    console.log(userStorySessionMappingId);
    console.log(storyPoint);
    if (teamMemberId && userStorySessionMappingId && storyPoint == undefined) {
      res.status(400).json({ error: "Bad Request - Missing required fields" });
      return;
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
      res.status(200).json({ message: "Data modified successfully", data });
    } else {
      data = await participantScores.create(
        {
          teamMemberId,
          userStorySessionMappingId,
          storyPoint,
        },
        { raw: true }
      );

      res.status(201).json({ message: "Data inserted successfully", data });
    }
  } catch (error: any) {
    console.error("Error adding participant scores:", error);

    let errorMessage = "Internal Server Error";

    if (error.name === "SequelizeValidationError") {
      errorMessage =
        "Validation Error: " +
        error.errors.map((e: any) => e.message).join(", ");
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: errorMessage });
    }
  }
};

export default addParticipantScores;
