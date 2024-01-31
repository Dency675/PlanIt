import { Request, Response } from "express";
import Session from "../../models/sessions";

interface SessionPostResponse {
  message: string;
  data: Session;
}
/**
 * Adds a new session to the database.
 *
 * @param {Request} req - Express Request object containing session data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response<SessionPostResponse>>} - A JSON response indicating the success or failure of the session creation operation.
 */
const addSessions = async (
  req: Request,
  res: Response
): Promise<Response<SessionPostResponse>> => {
  try {
    const {
      sessionTitle,
      createDateTime,
      timer,
      excelLink,
      teamId,
      scrumMasterId,
      estimationId,
      calculationId,
    }: Session = req.body;

    if (
      !sessionTitle ||
      !createDateTime ||
      !excelLink ||
      !teamId ||
      !scrumMasterId ||
      !estimationId ||
      !calculationId
    ) {
      return res
        .status(400)
        .send("data missing")
        .json({ message: "Missing required fields" });
    }

    const newSession = await Session.create({
      sessionTitle: sessionTitle,
      createDateTime: createDateTime,
      timer,
      excelLink: excelLink,
      teamId: teamId,
      scrumMasterId: scrumMasterId,
      estimationId: estimationId,
      calculationId: calculationId,
    });

    const responseData: SessionPostResponse = {
      message: "Session created successfully",
      data: newSession,
    };

    return res.status(201).json(responseData);
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addSessions;
