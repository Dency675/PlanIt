import { Request, Response } from "express";
import userStories from "../../models/userStories";

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
    const { userStories: userStoriesArray } = req.body;
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

    const createdUserStories = await userStories.bulkCreate(
      userStoriesArray.map((userStory: string) => ({ userStory }))
    );

    res.status(200).json({
      message: "Data inserted successfully",
      data: createdUserStories,
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
