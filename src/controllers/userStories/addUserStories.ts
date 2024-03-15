import { Request, Response } from "express";
import userStories from "../../models/userStories";
import userStorySessionMapping from "../../models/userStorySessionMapping";

/**
 * Express route handler to add user stories to the database.
 * Expects an array of user stories in the request body.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void>
 */

const addUserStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userStories: userStoriesArray, sessionId } = req.body;
    if (
      !userStoriesArray ||
      !Array.isArray(userStoriesArray) ||
      userStoriesArray.length === 0
    ) {
      res.status(400).json({
        error:
          "Bad Request: 'userStories' should be a non-empty array in the request body.",
      });
      return;
    }

    const createdUserStories = await Promise.all(
      userStoriesArray.map(
        ({ userStory, userStoryId, description, issueKey }) =>
          userStories.create({ userStory, userStoryId, description, issueKey })
      )
    );

    const userStoryIds = createdUserStories.map(
      (userStory: any) => userStory.id
    );

    const createdUserStorySessionMapping = await Promise.all(
      userStoryIds.map((userStoryId: any) =>
        userStorySessionMapping.create(
          {
            userStoryId,
            sessionId,
            roundNumber: 0,
            comment: "",
            storyPointResult: 0,
          },
          { raw: true }
        )
      )
    );

    res.status(200).json({
      message: "Data inserted successfully",
      data: { createdUserStories, createdUserStorySessionMapping },
    });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({ error: "Validation Error", validationErrors });
    } else {
      console.error("Error in addUserStories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default addUserStories;
