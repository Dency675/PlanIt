import { Request, Response } from "express";
import userStorySessionMapping from "../../models/userStorySessionMapping";

/**
 * Express route handler to update comment and storyPointResult for a specific user story session mapping.
 * Expects the userStorySessionMappingId, comment, and storyPointResult in the request body.
 *
 * @param req - Express Request object with userStorySessionMappingId, comment, and storyPointResult in the body
 * @param res - Express Response object
 * @returns Promise<void>
 */
const updateUserStorySessionMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userStorySessionMappingId, comment, storyPointResult } = req.body;

    if (
      !userStorySessionMappingId ||
      (comment === undefined && storyPointResult === undefined)
    ) {
      res.status(400).json({
        error:
          "Bad Request: 'userStorySessionMappingId' and at least one of 'comment' or 'storyPointResult' are required in the request body.",
      });
      return;
    }

    const existingMapping = await userStorySessionMapping.findByPk(
      userStorySessionMappingId
    );

    if (!existingMapping) {
      res.status(404).json({
        error:
          "Not Found: User story session mapping not found with the provided userStorySessionMappingId.",
      });
      return;
    }

    if (comment !== undefined) {
      existingMapping.comment = comment;
    }

    if (storyPointResult !== undefined) {
      existingMapping.storyPointResult = storyPointResult;
    }

    await existingMapping.save();

    res.status(200).json({
      message: "Data updated successfully",
      updatedUserStorySessionMapping: existingMapping,
    });
  } catch (error: any) {
    console.error("Error in updateUserStorySessionMapping:", error);

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

export default updateUserStorySessionMapping;
