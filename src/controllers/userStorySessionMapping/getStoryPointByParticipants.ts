import { Request, Response } from "express";
import UserStorySessionMapping from "../../models/userStorySessionMapping";
import ParticipantScores from "../../models/participantScores";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";

const getStoryPointByParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.query;

    const userStorySessionMappings = await UserStorySessionMapping.findAll({
      where: { sessionId },
      attributes: ["userStoryId", "sessionId"],
      include: [
        {
          model: ParticipantScores,
          as: "participantScores",
          attributes: ["teamMemberId", "storyPoint"],
          include: [
            {
              model: teamMemberInformation,
              attributes: ["userId"],
              where: { status: "active" },
              include: [
                {
                  model: userInformation,
                  attributes: ["givenName", "surName"],
                  where: { status: "active" },
                },
              ],
            },
          ],
        },
      ],
    });

    interface scoreType {
      teamMemberId: any;
      storyPoint: any;
      teamMemberInformation: {
        userInformation: { givenName: any; surName: any };
      };
    }

    const formattedData = userStorySessionMappings.map((mapping) => ({
      userStoryId: mapping.userStoryId,
      participantScores: mapping.participantScores.map((score: scoreType) => ({
        storyPoint: score.storyPoint,
        participantName: `${score.teamMemberInformation.userInformation.givenName} ${score.teamMemberInformation.userInformation.surName}`,
      })),
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching session story points:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export default getStoryPointByParticipants;
