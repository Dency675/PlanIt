import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import Session from "../../models/sessions";
import { Op } from "sequelize";

/**
 * Retrieves all recent meetings of a user based on their user ID, with optional sorting, date filters, and pagination.
 *
 * @param {Request} req - Express Request object containing user ID and query parameters.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response containing the recent meetings of the user.
 */

const getAllRecentMeetingsOfUser = async (req: Request, res: Response) => {
  try {
    const { userId, sortBy, sortOrder, fromDate, toDate, page, pageSize } =
      req.body;

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

    const queryOptions: any = {
      attributes: ["sessionTitle", "createDateTime"],
      where: {
        teamId: teamId,
        status: "completed",
      },
      order: [],
      offset: 0,
      limit: 10,
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

    // Pagination
    if (page && pageSize) {
      queryOptions.offset = (page - 1) * pageSize;
      queryOptions.limit = pageSize;
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
