import { Request, Response } from "express";
import SessionParticipant from "../../models/sessionParticipants";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";

/**
 * Retrieves participants in a session by session ID.
 *
 * @param {Request} req - Express Request object containing the session ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response containing participants' details or an error message along with the appropriate status code.
 */

const getParticipantsInSession = async (
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
      },
      include: [
        {
          model: UserInformation,
          attributes: ["givenName", "email"],
          as: "user",
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

export default getParticipantsInSession;
