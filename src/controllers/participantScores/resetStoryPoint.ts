import { Request, Response } from "express";
import participantScores from "../../models/participantScores";

const resetStoryPoint = async (req: Request, res: Response) => {
    const { userStorySessionMappingId } = req.body;
    try {
      const result = await participantScores.update(
        { storyPoint: '0' },
        { where: { userStorySessionMappingId: userStorySessionMappingId } }
      );
      res.json({ success: true, message: 'Story points updated successfully', result });
    } catch (error) {
      res.status(500).json({message: 'Failed to update story points', error: error });
    }
  }
export default resetStoryPoint;
