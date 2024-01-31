import { Request, Response } from "express";
import userInformation from "../../models/userInformation";

/**
 * Handles the creation of a new user Record in the user information table.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const postUserInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, givenName, surName, email, department, jobTitle, joinDate, lastLoginTime, status } = req.body;

    if (!employeeId || !givenName || !surName || !email || !department || !jobTitle || !joinDate || !status) {
      res.status(400).json({
        error: "Missing required fields in request body",
      });
      return;
    }

    const userInformationAdd = await userInformation.create({
      employeeId, givenName, surName, email, department, jobTitle, joinDate, lastLoginTime, status
    });

    res.status(200).json({
      message: "User information inserted successfully",
      data: userInformationAdd.toJSON(),
    });
  } catch (error) {
    console.error("Error inserting user information:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default postUserInformation;
