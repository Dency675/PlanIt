import { Request, Response } from "express";
import user_story_session_mapping from "../../model/user_story_session_mapping";

const add_user_story_session_mapping = async (
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

    const data = await user_story_session_mapping.create(
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
  } catch (error) {
    console.error("Error adding user story session mapping:", error);

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

export default add_user_story_session_mapping;
