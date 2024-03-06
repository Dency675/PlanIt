import { Request, Response } from "express";
import NoteInformation from "../../models/noteInformation";

/**
Retrieves NoteInformation records by their unique identifier (id).
@param {Request} req - Express Request object containing the note id.
@param {Response} res - Express Response object for sending the server's response.
@returns {Promise<Response>} - A JSON response containing the requested NoteInformation
or an error message along with the appropriate status code.
*/

const getNoteInformationById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(422).json({
        error: "note_id is missing ",
      });
    }

    if (isNaN(Number(id))) {
      return res.status(422).json({
        error: "Invalid note_id parameter. Note ID must be a number.",
      });
    }

    const responseData = await NoteInformation.findAll({
      raw: true,
      where: { id },
    });

    if (responseData.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ data: responseData });
  } catch (error) {
    console.error("Error in noteInformationGet:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getNoteInformationById;
