import { Request, Response } from "express";
import participantScores from "../../models/participantScores";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

const resetStoryPoint = async (req: Request, res: Response) => {
  const { userStorySessionMappingId } = req.body;
  try {
    const result = await participantScores.update(
      { storyPoint: "0" },
      { where: { userStorySessionMappingId: userStorySessionMappingId } }
    );
    return success(res, 200, result, "Story points updated successfully");
  } catch (error) {
    return failure(res, 500, error, "Failed to update story points");
  }
};
export default resetStoryPoint;
