import { Request, Response } from "express";
import NoteInformation from "../../models/noteInformation";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Deletes a note from the NoteInformation model by its unique identifier (id).
 *
 * @param {Request} req - Express Request object containing the note id.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} - A JSON response indicating the success or failure of the deletion operation.
 */
const deleteNoteInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.params.id;

    if (!id || isNaN(Number(id))) {
      return res.status(422).json({
        error: "Invalid note_id parameter. Note ID must be a number.",
      });
    }

    const noteToDelete = await NoteInformation.findOne({ where: { id } });
    if (!noteToDelete) {
      return res.status(404).json({ error: "Note not found" });
    }

    await NoteInformation.destroy({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: `Note with id ${id} successfully deleted` });
  } catch (error) {
    console.error("Error in deleteNoteInformation:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default deleteNoteInformation;
