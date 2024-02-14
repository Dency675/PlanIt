import { Request, Response } from "express";
import SessionParticipants from "../../models/sessionParticipants";

/**
 * Edits the status of a session participant identified by its session ID and user ID.
 *
 * @param {Request} req - Express Request object containing the session ID, user ID, and new isJoined value.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response indicating the success or failure of the session participant update operation.
 */

const editSessionParticipants = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { sessionId, userId } = req.body;

    if (!sessionId || !userId) {
      return res
        .status(400)
        .json({ message: "Session ID and user ID are required" });
    }

    const sessionParticipant = await SessionParticipants.findOne({
      where: { sessionId: sessionId, userId: userId },
    });

    if (!sessionParticipant) {
      return res.status(404).json({ message: "Session participant not found" });
    }

    sessionParticipant.isJoined = true;
    await sessionParticipant.save();

    return res.status(200).json({
      message: "Session participant updated successfully",
      data: sessionParticipant,
    });
  } catch (error) {
    console.error("Error updating session participant:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default editSessionParticipants;
