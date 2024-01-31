import { Request, Response } from "express";
import Session from "../../models/sessions";
import Team from "../../models/teamInformation";
import User from "../../models/userInformation";
import Estimation from "../../models/estimations";
import Calculation from "../../models/calculations";
import { Sequelize } from "sequelize";

/**
 * Retrieves session details by session ID.
 *
 * @param {Request} req - Express Request object containing the session ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response containing session details or an error message along with the appropriate status code.
 */

const getSessionById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId } = req.query;

    const sessions = await Session.findOne({
      where: { id: sessionId },
      include: [
        { model: Team, as: "team" },
        { model: User, as: "scrumMaster" },
        { model: Estimation, as: "estimation" },
        { model: Calculation, as: "calculation" },
      ],
      attributes: [
        "id",
        "sessionTitle",
        "createDateTime",
        "timer",
        "excelLink",
        "estimationId",
        "calculationId",
        "status",
      ],
      group: ["Session.id"],
    });

    if (!sessions) {
      return res.status(404).json({ message: "Session not found" });
    }

    const formattedSessions = {
      id: sessions.id,
      sessionTitle: sessions.sessionTitle,
      createDateTime: sessions.createDateTime,
      timer: sessions.timer,
      excelLink: sessions.excelLink,
      estimationId: sessions.estimationName,
      calculationId: sessions.calculationName,
      status: sessions.status,
      teamName: sessions.team?.teamName,
      scrumMasterId: sessions.scrumMaster?.id,
      scrumMasterName: sessions.scrumMaster?.name,
      scrumMasterEmail: sessions.scrumMaster?.email,
      scrumMasterEmployeeId: sessions.scrumMaster?.employeeId,
      estimationName: sessions.estimation?.estimationName,
      calculationName: sessions.calculation?.calculationName,
    };

    return res.status(200).json({
      message: "Sessions retrieved successfully",
      data: formattedSessions,
    });
  } catch (error) {
    console.error("Error retrieving sessions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getSessionById;
