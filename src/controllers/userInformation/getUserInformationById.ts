import { Request, Response } from "express";
import userInformation from "../../models/userInformation";

/**
 * Handles the retrieval of user information
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const getUserInformationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query;
    const found = await userInformation.findOne({
      where: { id: id },
    });

    if (found) {
      res.status(200).json({
        message: "Data retrieved successfully",
        data: found,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
      });
    }
  } catch (error) {
    console.error("Error in retrieving User:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};
export default getUserInformationById;
