import { Request, Response } from "express";
import userInformation from "../../models/userInformation";
import participantScores from "../../models/participantScores";
import SessionParticipants from "../../models/sessionParticipants";
import teamMemberInformation from "../../models/teamMemberInformation";
import sessions from "../../models/sessions";
import { Op } from "sequelize";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

const listOfParticipantsWithTheirScore = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId } = req.body;

    const enteredSession = await sessions.findByPk(sessionId);
    if (!enteredSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    const teamId = enteredSession.teamId;

    const participants = await SessionParticipants.findAll({
      where: {
        sessionId: sessionId,
        isJoined: true,
        roleId: 5,
      },
      attributes: ["userId"],
    });
    const userIds = participants.map((participant) => participant.userId);

    const teamMemberIds = await teamMemberInformation.findAll({
      where: {
        teamId: teamId,
        userId: { [Op.in]: userIds },
      },
      attributes: ["id"],
      include: [
        {
          model: userInformation,
          attributes: ["givenName"],
        },
      ],
    });

    const transformedTeamMember = teamMemberIds.map((member) => ({
      id: member.id,
      givenName: member.userInformation.givenName,
    }));

    const transformedTeamMemberIds = transformedTeamMember.map(
      (member) => member.id
    );

    const scores = await participantScores.findAll({
      attributes: ["storyPoint"],
      include: [
        {
          model: teamMemberInformation,
          where: { id: { [Op.in]: transformedTeamMemberIds } },
          attributes: ["id"],
        },
      ],
    });

    const transformedScores = scores.map((member) => ({
      storyPoint: member.storyPoint,
      id: member.teamMemberInformation.id,
    }));

    const combinedResult = transformedTeamMember.map((member) => {
      const score = transformedScores.find((score) => score.id === member.id);
      return {
        givenName: member.givenName,
        storyPoint: score ? score.storyPoint : null,
      };
    });

    res.status(200).json({ combinedResult });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default listOfParticipantsWithTheirScore;
