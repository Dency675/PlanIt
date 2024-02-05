import { Request, Response } from "express";
import UserStorySessionMapping from "../../models/userStorySessionMapping";
import UserStories from "../../models/userStories";

/**
 * Retrieves all user stories of a session with round number and story point result.
 *
 * @param {Request} req - Express Request object containing the session ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response containing user stories with round number and story point result or an error message along with the appropriate status code.
 */
const getAllUserStoriesBySessionId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId } = req.query;

    // Query user story session mapping table to get user story IDs, round number, and story point result
    const userStoryMappings = await UserStorySessionMapping.findAll({
      where: { sessionId: sessionId },
      attributes: ["userStoryId", "roundNumber", "storyPointResult"],
      include: [
        {
          model: UserStories,
          as: "userStory",
          attributes: ["id", "userStory"],
        },
      ],
    });

    const formattedUserStories = userStoryMappings.map((mapping: any) => ({
      userStoryId: mapping.userStoryId,
      roundNumber: mapping.roundNumber,
      storyPointResult: mapping.storyPointResult,
      userStory: mapping.userStory.userStory,
    }));

    return res.status(200).json({
      message: "User stories retrieved successfully",
      data: formattedUserStories,
    });
  } catch (error) {
    console.error("Error retrieving user stories:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getAllUserStoriesBySessionId;
