import { Request, Response } from "express";
import userInformation from "../../models/userInformation";

/**
 * Handles the retrieval of all user information from user information table
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await userInformation.findAll();

    if (allUsers.length > 0) {
      res.status(200).json({
        message: "Data retrieved successfully",
        data: allUsers,
      });
    } else {
      res.status(404).json({
        message: "No user data found",
      });
    }
  } catch (error) {
    console.error("Error in retrieving users:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error, 
    });
  }
};

export default getAllUsers;
