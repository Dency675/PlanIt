import { Request, Response } from "express";
import participantScores from "../../models/participantScores";

const addParticipantScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamMemberId, userStorySessionMappingId, storyPoint } = req.body;

    if (!teamMemberId || !userStorySessionMappingId || !storyPoint) {
      res.status(400).json({ error: "Bad Request - Missing required fields" });
      return;
    }

    const data = await participantScores.create(
      {
        teamMemberId,
        userStorySessionMappingId,
        storyPoint,
      },
      { raw: true }
    );

    res.status(201).json({ message: "Data inserted successfully", data });
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
