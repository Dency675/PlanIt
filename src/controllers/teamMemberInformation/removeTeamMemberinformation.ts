import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";

/**
 * Handles the removal of Team member information.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */
const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        error: "User ID is missing in the request body",
      });
      return;
    }

    const update = await TeamMemberInformation.update(
      { status: 'inactive' },
      { where: { userId: userId } }
    );

    if (update[0] === 0) {
      res.status(404).json({
        error: "User not found or not updated",
      });
      return;
    }

    res.status(200).json({
      message: "Team member information updated successfully",
    });
  } catch (error) {
    console.error("Error updating team member information:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default removeTeamMember;
