import { Request, Response } from "express";
import Session from "../../models/sessions";

/**
 * Retrieves all recent completed meetings for a given team.
 *
 * @param {Request} req - Express Request object containing the team id.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response containing the recent completed meetings or an error message along with the appropriate status code.
 */

const getAllRecentMeetings = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.query;

    if (!teamId) {
      return res
        .status(400)
        .json({ error: "team id is required in the request body" });
    }

    const completedSessions = await Session.findAll({
      attributes: [
        "id",
        "sessionTitle",
        "createDateTime",
        "scrumMasterId",
        "status",
      ],
      where: {
        team_id: teamId,
        status: "completed",
      },
    });

    if (!completedSessions.length) {
      return res.status(204).send("No Content");
    }

    return res.json(completedSessions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllRecentMeetings;
