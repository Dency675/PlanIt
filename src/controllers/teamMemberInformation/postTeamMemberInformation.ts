import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";

/**
 * Handles the creation of Team member information.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A Promise indicating the completion of the operation.
 */
const addTeamMemberInformation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, teamId } = req.body;

    if (!userId || !teamId) {
      res.status(400).json({
        error: "Missing required fields in request body",
      });
      return;
    }

    const isUserActive = await userInformation.findOne({
      where: {
        id: userId,
        status: "active",
      },
    });

    if (!isUserActive) {
      res.status(400).json({
        error: "User is not active",
      });
      return;
    }

    const newTeamMember = await teamMemberInformation.create({
      userId,
      teamId,
      roleId: "1",
      status: "active",
    });
    res.status(201).json({
      message: "Team member inserted successfully",
      data: newTeamMember.toJSON(),
    });
  } catch (error) {
    console.error("Error inserting team member:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default addTeamMemberInformation;
