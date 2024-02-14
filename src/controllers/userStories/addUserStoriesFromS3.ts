import { Request, Response } from "express";
import getS3Data from "./getUserStoryFromS3"; 
import userStories from "../../models/userStories";

/**
 * Express route handler to add user stories to the database from S3.
 * Expects the key in the request body.
 *
 * @param req - Express Request object with key in the body
 * @param res - Express Response object
 * @returns Promise<void>
 */
const addUserStoriesFromS3 = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.body;

    if (!key) {
      res.status(400).json({
        error: "Bad Request: 'key' is required in the request body.",
      });
      return;
    }

    const s3DataResponse = await getS3Data(req, res);

    const userStoriesArray = s3DataResponse.data;

    const createdUserStories = await userStories.bulkCreate(
      userStoriesArray.map((userStory: any) => ({
        key,
        userStory: userStory.userStory,
      }))
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
      console.error("Error in addUserStoriesFromS3:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default addUserStoriesFromS3;
