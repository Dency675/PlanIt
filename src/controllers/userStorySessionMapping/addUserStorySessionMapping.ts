import { Request, Response } from "express";
import userStorySessionMapping from "../../models/userStorySessionMapping";

/**
 * Handles the addition of a user story session mapping.
 * @param req - Express Request object.
 * @param res - Express Response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */

const addUserStorySessionMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userStoryId, sessionId, roundNumber, comment, storyPointResult } =
      req.body;

    if (
      !userStoryId ||
      !sessionId ||
      !roundNumber ||
      !comment ||
      !storyPointResult
    ) {
      res.status(400).json({ error: "Bad Request - Missing required fields" });
      return;
    }

    const data = await userStorySessionMapping.create(
      {
        userStoryId,
        sessionId,
        roundNumber,
        comment,
        storyPointResult,
      },
      { raw: true }
    );
    res.status(201).json({ message: "Data inserted successfully", data });
  } catch (error: any) {
    console.error("Error adding user story session mapping:", error);

    let errorMessage = "Internal Server Error";

    if (error.name === "SequelizeValidationError") {
      errorMessage =
        "Validation Error: " +
        error.errors.map((e: any) => e.message).join(", ");
      res.status(400).json({ error: errorMessage });
      return;
    }
    res.status(500).json({ error: errorMessage });
  }
};

export default addUserStorySessionMapping;
