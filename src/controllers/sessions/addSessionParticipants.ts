import { Request, Response } from "express";
import SessionParticipant from "../../models/sessionParticipants";

/**
 * Adds participants to a session.
 *
 * @param {Request} req - Express Request object containing participant data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response indicating the success or failure of the operation.
 */

const addSessionParticipants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const participantData: {
      sessionId: number;
      userId: string;
      roleId: number;
    }[] = req.body;

    if (!participantData || participantData.length === 0) {
      return res.status(400).json({ message: "No participant data provided" });
    }

    const insertedParticipants = [];

    for (const data of participantData) {
      const existingParticipant = await SessionParticipant.findOne({
        where: {
          sessionId: data.sessionId,
          userId: data.userId,
          roleId: data.roleId,
        },
      });

      if (existingParticipant)
        return res.status(404).json({ message: "User already in the session" });

      if (!existingParticipant) {
        const participant = await SessionParticipant.create(data);
        insertedParticipants.push(participant);
      }
    }

    return res.status(201).json({
      message: "Participants added successfully",
      data: insertedParticipants,
    });
  } catch (error) {
    console.error("Error adding participants:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addSessionParticipants;
