import userStories from "../../models/userStories";
import { Request, Response } from "express";

const addUserStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userStory } = req.body;
    if (!userStory) {
      res.status(400).json({
        error: "Bad Request: 'user story' is required in the request body.",
      });
      return;
    }

    const data = await userStories.create(
      { userStory: userStory },
      { raw: true }
    );

    res.status(200).json({ message: "Data inserted successfully", data });
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
