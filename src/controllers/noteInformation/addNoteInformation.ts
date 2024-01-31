import { Request, Response } from "express";
import NoteInformation from "../../models/noteInformation";

/**
 * Handles the creation of a new note in the NoteInformation model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */

const addNoteInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { noteTitle, content } = req.body;

    if (!noteTitle || !content) {
      return res.status(422).json({
        error: "note_title or content is missing ",
      });
    }

    const createdNote = await NoteInformation.create({
      noteTitle: noteTitle,
      content: content,
    });

    return res.status(201).json({ message: "Note created", data: createdNote });
  } catch (error) {
    console.error("Error in noteInformationPost:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addNoteInformation;
