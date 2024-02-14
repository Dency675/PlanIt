import { Request, Response } from "express";
import TeamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";
import teamInformation from "../../models/teamInformation";
import { sendEmailNotification } from "../email/send_mail";

/**
 * Handles the removal of Team member information.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */
const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).json({
        error: "User ID is missing in the request body",
      });
      return;
    }

    const update = await TeamMemberInformation.update(
      { status: 'inactive' },
      { where: { id: id } }
    );

    if (update[0] === 0) {
      res.status(404).json({
        error: "User not found or not updated",
      });
      return;
    }

    const teamMemberInfo = await TeamMemberInformation.findOne({
      where: { id: id },
      include: [
        {
          model: userInformation,
          attributes: ['givenName', 'email'],
        },
        {
          model: teamInformation,
          attributes: ['teamName'],
        },
      ],})

      if (!teamMemberInfo) {
        throw new Error('Team member information not found');
      }
  
      const userInfo = [{
        name: teamMemberInfo.userInformation.givenName,
        email: teamMemberInfo.userInformation.email,
        teamName: teamMemberInfo.teamInformation.teamName,
      }];

      sendEmailNotification("teamMemberDeleted",userInfo)

    res.status(200).json({
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error("Error updating team member information:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default removeTeamMember;
