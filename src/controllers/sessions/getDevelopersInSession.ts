import { Request, Response } from "express";
import SessionParticipant from "../../models/sessionParticipants";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";
import teamMemberInformation from "../../models/teamMemberInformation";
import participantScores from "../../models/participantScores";
import Session from "../../models/sessions";
import { Sequelize } from "sequelize";

/**
 * Retrieves developers participating in a session based on the provided session ID.
 *
 * @param {Request} req - Express Request object containing the session ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response containing developer information in the session or an error message along with the appropriate status code.
 */

const getDevelopersInSession = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const participants = await SessionParticipant.findAll({
      where: {
        sessionId: sessionId,
        roleId: 5,
        isJoined: true,
        // "$Session.teamid$": Sequelize.col("user.teamMember.teamId"),
      },
      include: [
        // {
        //   model: Session,
        //   attributes: ["teamId"],
        //   // where: {
        //   //   teamid: Sequelize.col("teamMember.teamId"),
        //   // },
        // },
        {
          model: UserInformation,
          attributes: ["givenName", "email", "id"],
          as: "user",
          include: [
            {
              model: teamMemberInformation,
              attributes: ["id", "teamId"],
              as: "teamMember",
              include: [
                {
                  model: Session,
                  attributes: [],
                  //   where: { teamid: Sequelize.col("teamMember.teamId") },
                  as: "sessionTeam",
                },

                {
                  model: participantScores,
                  attributes: ["id", "storyPoint"],
                  as: "sessionParticipant",
                },
              ],
            },
          ],
        },
        {
          model: Role,
          attributes: ["roleName", "id"],
          as: "role",
        },
      ],
    });

    const participantData = participants.map((participant) => ({
      userName: participant.user.givenName,
      userEmail: participant.user.email,
      userRole: participant.role.roleName,
      roleId: participant.roleId,
      teamMemberId: participant.user.teamMember[0].id,
      score: participant.user.teamMember,
    }));

    participantData.sort((a, b) => a.roleId - b.roleId);

    return res.status(200).json({
      message: "Participants retrieved successfully",
      data: participantData,
    });
  } catch (error) {
    console.error("Error retrieving participants:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getDevelopersInSession;
