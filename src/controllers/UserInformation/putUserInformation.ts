import { Request, Response } from "express";
import userInformation from "../../models/userInformation";

/**
 * Handles the updation of user information
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */
const putUserInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.userId as string; 
    const { employeeId, givenName, surName, email, department, jobTitle, joinDate, lastLoginTime, status  } = req.body;
    const user = await userInformation.findByPk(userId);

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
      return;
    }

    await user.update({
        employeeId, givenName, surName, email, department, jobTitle, joinDate, lastLoginTime, status 
    });

    res.status(200).json({
      message: "User information updated successfully",
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default putUserInformation;
