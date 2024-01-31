import { Request, Response } from "express";
import Session from "../../models/sessions";

/**
 * Retrieves all ongoing meetings for a given team ID.
 *
 * @param {Request} req - Express Request object containing the team ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response containing ongoing meetings or an error message along with the appropriate status code.
 */

const getAllOngoingMeetings = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res
        .status(400)
        .json({ error: "team id is required in the request body" });
    }

    const ongoingSessions = await Session.findAll({
      attributes: ["sessionTitle", "createDateTime"],
      where: {
        teamId: teamId,
        status: "active",
      },
    });

    if (!ongoingSessions.length) {
      return res.status(204).send("No Content");
    }

    res.json(ongoingSessions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllOngoingMeetings;
