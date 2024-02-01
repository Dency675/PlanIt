import { Request, Response } from "express";
import userStorySessionMapping from "../../models/userStorySessionMapping";

const getUserStoryCountsBySession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.body;

    const userStoryMappings = await userStorySessionMapping.findAll({
      where: { sessionId },
    });

    const totalCount = userStoryMappings.length;

    const completeStoryCount = userStoryMappings.filter(
      (mapping) => mapping.storyPointResult !== 0
    ).length;

    const incompleteUserStoryCount = userStoryMappings.filter(
      (mapping) => mapping.storyPointResult === 0
    ).length;

    res.status(200).json({
      totalCount,
      completeStoryCount,
      incompleteUserStoryCount,
    });
  } catch (error) {
    console.error("Error in getUserStoryCountsBySession:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default getUserStoryCountsBySession;
