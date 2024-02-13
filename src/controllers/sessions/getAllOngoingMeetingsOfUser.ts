import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import Session from "../../models/sessions";
import { Op } from "sequelize";

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

    if (!teamMemberInfo || teamMemberInfo.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found", ongoingMeetings: [] });
    }

    const teamIds = teamMemberInfo.map((member) => member.teamId);

    const ongoingMeetings = await Session.findAll({
      attributes: [
        "id",
        "sessionTitle",
        "createDateTime",
        "scrumMasterId",
        "status",
      ],
      where: {
        teamId: {
          [Op.in]: teamIds,
        },
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
