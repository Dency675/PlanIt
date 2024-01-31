import { Request, Response } from "express";
import userStories from "../../models/userStories";

/**
 * Express route handler to update a user story in the database.
 * Expects 'id' and 'userStory' in the request body.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Promise<void>
 */

const updateUserStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userStory } = req.body;

    if (!userStory || !id) {
      res.status(400).json({
        error:
          "Bad Request: Both 'id' and 'user_story' are required in the request body.",
      });
      return;
    }

    const existingStory = await userStories.findOne({
      where: { id },
      raw: true,
    });

    if (!existingStory) {
      res.status(404).json({
        error: "Not Found: User story with the provided ID not found.",
      });
      return;
    }

    await userStories.update({ userStory }, { where: { id } });

    res.status(200).json({ message: "Data updated successfully" });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({ error: "Validation Error", validationErrors });
    } else {
      console.error("Error in updateUserStories:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default updateUserStory;
