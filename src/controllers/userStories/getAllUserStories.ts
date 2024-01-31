import { Request, Response } from "express";
import userStories from "../../models/userStories";

const getAllUserStories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await userStories.findAll({
      raw: true,
    });
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error in getAllUserStories:", error);

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

export default getAllUserStories;
