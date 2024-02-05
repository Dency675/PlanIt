import { Request, Response } from "express";
import Session from "../../models/sessions";
import Team from "../../models/teamInformation";
import User from "../../models/userInformation";
import Estimation from "../../models/estimations";
import Calculation from "../../models/calculations";
import { Sequelize } from "sequelize";
import SessionParticipants from "../../models/sessionParticipants";
import participantScores from "./../../models/participantScores";
import roles from "../../models/roles";

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
        {
          model: SessionParticipants,
          as: "participants",
          include: [
            { model: User, as: "user" },
            { model: roles, as: "role" },
          ],
          where: { isJoined: true },
        },
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
        [
          Sequelize.fn("COUNT", Sequelize.col("participants.id")),
          "participantCount",
        ],
      ],
      group: ["Session.id", "participants.id"],
    });

    if (!sessions) {
      return res.status(404).json({ message: "Session not found" });
    }

    const participants = sessions.participants.map((participant: any) => ({
      userId: participant.user.id,
      userName: participant.user.givenName,
      userEmail: participant.user.email,
      userRole: participant.role.roleName,
    }));

    let productOwnerName = "";
    let projectManagerName = "";
    let developerList: any[] = [];
    let guestList: any[] = [];

    sessions.participants.forEach((participant: any) => {
      const { role, user } = participant;
      switch (role.roleName) {
        case "product owner":
          productOwnerName = user.givenName;
          break;
        case "project manager":
          projectManagerName = user.givenName;
          break;
        case "developer":
          developerList.push({
            userId: user.id,
            userName: user.givenName,
            userEmail: user.email,
          });
          break;
        case "guest":
          guestList.push({ userId: user.id, userName: user.givenName });
          break;
        default:
          break;
      }
    });

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
      participantCount: participants.length,
      productOwnerName: productOwnerName,
      projectManagerName: projectManagerName,
      developerList: developerList,
      guestList: guestList,
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
