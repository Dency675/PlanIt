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
    const { sessionId, participants } = req.body;

    if (!sessionId || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const insertedParticipants = [];

    for (const participant of participants) {
      const { userId, roleId } = participant;

      const existingParticipant = await SessionParticipant.findOne({
        where: {
          sessionId: sessionId,
          userId: userId,
          roleId: roleId,
        },
      });

      if (existingParticipant) {
        return res.status(400).json({ message: "User already in the session" });
      }

      const newParticipant = await SessionParticipant.create({
        sessionId: sessionId,
        userId: userId,
        roleId: roleId,
      });

      insertedParticipants.push(newParticipant);
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
