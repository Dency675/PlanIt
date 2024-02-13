import { Request, Response } from "express";
import Session from "../../models/sessions";

/**
 * Edits the status of a session identified by its session ID.
 *
 * @param {Request} req - Express Request object containing the session ID and status.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response indicating the success or failure of the session update operation.
 */

const editSessions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { sessionId, status } = req.body;

    if (!sessionId || !status) {
      return res
        .status(400)
        .json({ message: "Session ID and status are required" });
    }

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = status;
    await session.save();

    return res
      .status(200)
      .json({ message: "Session updated successfully", data: session.status });
  } catch (error) {
    console.error("Error updating session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default editSessions;
