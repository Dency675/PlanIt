import { Request, Response } from "express";
import NoteInformation from "../../models/noteInformation";

/**
 * Edits the content of a note in the NoteInformation model.
 *
 * @param {Request} req - Express Request object containing noteId and newContent.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response indicating the success or failure of the operation.
 */

const editNoteInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { noteId, newContent } = req.body;

    if (!noteId || !newContent) {
      return res.status(422).json({
        error: "note_id or content is missing ",
      });
    }

    const updatedNote = await NoteInformation.update(
      { content: newContent },
      {
        where: { id: noteId },
        returning: true,
      }
    );

    if (!updatedNote[1]) {
      return res
        .status(404)
        .json({ error: `Note with ID ${noteId} not found` });
    }

    return res
      .status(200)
      .json({ message: `Note ${noteId} found`, data: updatedNote[1] });
  } catch (error) {
    console.error("Error in noteInformationPut:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default editNoteInformation;
