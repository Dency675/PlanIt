import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import Session from "../../models/sessions";

/**
 * Retrieves all ongoing meetings of a user based on their user ID.
 *
 * @param {Request} req - Express Request object containing the user ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response containing the ongoing meetings of the user.
 */

const getAllOngoingMeetingsOfUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "user id is required in the request body" });
    }

    const teamMemberInfo = await TeamMemberInformation.findOne({
      where: { userId: userId },
    });

    if (!teamMemberInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    const teamId = teamMemberInfo.teamId;

    const ongoingMeetings = await Session.findAll({
      attributes: ["sessionTitle", "createDateTime"],
      where: {
        teamId,
        status: "active",
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
