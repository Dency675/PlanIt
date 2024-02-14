import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import Session from "../../models/sessions";
import { Op } from "sequelize";
import sessionParticipants from "../../models/sessionParticipants";

/**
 * Retrieves all ongoing meetings of a user based on their user ID.
 *
 * @param {Request} req - Express Request object containing the user ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response containing the ongoing meetings of the user.
 */

const getAllOngoingMeetingsOfUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "user id is required in the request body" });
    }

    const teamMemberInfo = await TeamMemberInformation.findAll({
      where: { userId: userId },
    });

    const teamIds = teamMemberInfo.map((member) => member.teamId);
    console.log(teamMemberInfo);

    const sessionIds = await sessionParticipants.findAll({
      where: { userId: userId },
    });

    const ongoingMeetings = await Session.findAll({
      attributes: [
        "id",
        "sessionTitle",
        "createDateTime",
        "scrumMasterId",
        "status",
      ],
      where: {
        [Op.or]: [
          { teamId: { [Op.in]: teamIds } }, // Check if teamId is in teamIds
          { id: { [Op.in]: sessionIds.map((session) => session.sessionId) } }, // Check if id is in sessionIds
        ],
        status: { [Op.or]: ["active", "not started"] },
      },
    });

    if (!ongoingMeetings.length) {
      return res.status(204).send("No Content");
    }

    res.json(ongoingMeetings);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllOngoingMeetingsOfUser;
