import { Request, Response } from "express";
import NoteInformation from "../../models/noteInformation";

/**
 * Retrieves a paginated list of NoteInformation records from the database.
 *
 * @param {Request} req - Express Request object containing pagination parameters.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response containing the paginated list of NoteInformation records
 * or an error message along with the appropriate status code.
 */
const getNoteInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { offset = 0, limit = 10 } = req.body;

    const options = {
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      raw: true,
    };

    const responseData = await NoteInformation.findAll(options);

    if (!responseData || responseData.length === 0) {
      return res.status(404).json({ message: "No NoteInformation found" });
    }

    return res.status(200).json({ data: responseData });
  } catch (error) {
    console.error("Error in getNoteInformation:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getNoteInformation;
