import { Request, Response } from "express";
import userInformation from "../../models/userInformation";
 
/**
 * Handles the retrieval of all user information from user information table with pagination
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */
 
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
 
    let { offset } = req.query;
 
    let skip: number = 0;
    if (offset) {
      skip = parseInt(offset as string);
    }
 
    const allUsers = await userInformation.findAll({
      limit: 7,
      offset: skip,
    });
 
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
 