import { Request, Response } from "express";
import userStories from "../../models/userStories";

const getUserStoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({
        error: "Bad Request: 'id' is required in the query parameters.",
      });
      return;
    }

    const data = await userStories.findOne({
      where: { id },
      raw: true,
    });

    if (!data) {
      res.status(404).json({ error: "User story not found" });
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in getUserStoryById:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      res.status(400).json({ error: "Validation Error", validationErrors });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default getUserStoryById;
