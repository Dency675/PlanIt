import { Request, Response } from "express";
import userStories from "../../models/userStories";
import userStorySessionMapping from "../../models/userStorySessionMapping";

/**
 * Get user story details by session ID.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void>
 */
const getUserStoryDetailBySessionId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId, offset = 0 } = req.query;

    const userStoryDetails = await userStorySessionMapping.findAll({
      where: { sessionId },
      attributes: ["userStoryId", "storyPointResult", "comment"],
      include: [
        {
          model: userStories,
          as: "userStory",
          attributes: ["id", "userStory"],
        },
      ],
      offset: parseInt(offset as string),
      limit: 6,
    });

    res.json(userStoryDetails);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getUserStoryDetailBySessionId;
