import { Request, Response } from "express";
import { Op, OrderItem } from "sequelize";
import NoteInformation from "../../models/noteInformation";

/**
Searches for NoteInformation records based on the provided parameters and
optionally sorts the results.
@param {Request} req - Express Request object containing client data.
@param {Response} res - Express Response object for sending the server's response.
@returns {Promise<Response>} -  A JSON response containing the search results
or an error message along with the appropriate status code.
*/

const searchAndSortNoteInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      sortBy,
      sortOrder = "asc",
      noteTitle,
    } = req.query as {
      sortBy?: string;
      sortOrder?: string;
      noteTitle: string;
    };

    let order: OrderItem[] = [];
    if (sortBy && (sortBy === "noteTitle" || sortBy === "createdAt")) {
      const validSortOrders = ["asc", "desc"];
      if (!validSortOrders.includes(sortOrder.toLowerCase())) {
        return res.status(400).json({ message: "Invalid sortOrder parameter" });
      }
      order = [[sortBy, sortOrder]];
    } else {
      order = [["noteTitle", sortOrder]];
    }

    const trimmedNoteTitle = noteTitle ? noteTitle.trim() : "";

    const whereClause = trimmedNoteTitle
      ? {
          noteTitle: {
            [Op.like]: `%${trimmedNoteTitle}%`,
          },
        }
      : {};

    const results = await NoteInformation.findAll({
      where: whereClause,
      order: order,
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "No matching records found" });
    }

    console.log(results);
    return res.status(200).json({ message: results });
  } catch (error) {
    console.error("Error in noteInformationSearchAndSort:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default searchAndSortNoteInformation;
