import { Request, Response } from "express";
import getS3Data from "../userStories/getUserStoryFromS3";
import userStories from "../../models/userStories";
import userStorySessionMapping from "../../models/userStorySessionMapping";

/**
 * Express route handler to add user stories to the database from S3
 * and handle user story session mapping.
 * Expects the key and sessionId in the request body.
 *
 * @param req - Express Request object with key and sessionId in the body
 * @param res - Express Response object
 * @returns Promise<void>
 */
const addUserStoriesAndSessionMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      key,
      sessionId,
      roundNumber = 0,
      comment = "",
      storyPointResult = 0,
    } = req.body;

    if (!key || !sessionId) {
      res.status(400).json({
        error:
          "Bad Request: 'key' and 'sessionId' are required in the request body.",
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

    const userStoryIds = createdUserStories.map(
      (userStory: any) => userStory.id
    );

    const createdUserStorySessionMapping = await Promise.all(
      userStoryIds.map((userStoryId: any) =>
        userStorySessionMapping.create(
          {
            userStoryId,
            sessionId,
            roundNumber,
            comment,
            storyPointResult,
          },
          { raw: true }
        )
      )
    );

    res.status(200).json({
      message: "Data inserted successfully",
      userStories: createdUserStories,
      userStorySessionMapping: createdUserStorySessionMapping,
    });
  } catch (error: any) {
    console.error("Error in addUserStoriesAndSessionMapping:", error);

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

export default addUserStoriesAndSessionMapping;
