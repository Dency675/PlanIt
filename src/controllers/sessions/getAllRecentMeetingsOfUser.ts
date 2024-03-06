import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import Session from "../../models/sessions";
import { Op } from "sequelize";
import { off } from "process";
import sessionParticipants from "../../models/sessionParticipants";

/**
 * Retrieves all recent meetings of a user based on their user ID, with optional sorting, date filters, and pagination.
 *
 * @param {Request} req - Express Request object containing user ID and query parameters.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response containing the recent meetings of the user.
 */

const getAllRecentMeetingsOfUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const {
      sortBy,
      sortOrder,
      fromDate,
      toDate,
      // limit = 5,
      offset = 0,
    } = req.body;

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

    const queryOptions: any = {
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
        status: "completed",
      },
      order: [],
      offset: offset,
      // limit: limit,
    };

    // Sorting
    if (sortBy && sortOrder) {
      queryOptions.order.push([sortBy, sortOrder]);
    } else if (sortBy == "sessionTitle") {
      queryOptions.order.push(["sessionTitle", "ASC"]);
    } else if (sortBy == "createDateTime") {
      queryOptions.order.push(["createDateTime", "ASC"]);
    } else if (sortOrder == "DESC") {
      queryOptions.order.push(
        ["sessionTitle", "DESC"],
        ["createDateTime", "DESC"]
      );
    } else {
      queryOptions.order.push(
        ["sessionTitle", "ASC"],
        ["createDateTime", "ASC"]
      );
    }

    if (fromDate && toDate) {
      queryOptions.where.createDateTime = {
        [Op.between]: [fromDate, toDate],
      };
    }

    const completedSessions = await Session.findAll(queryOptions);

    if (!completedSessions.length) {
      return res.status(204).send("No Content");
    }

    res.json(completedSessions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllRecentMeetingsOfUser;
