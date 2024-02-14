import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";
import teamInformation from "../../models/teamInformation";
import { sendEmailNotification } from "../email/send_mail";

/**
 * Handles the creation of multiple Team members.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A Promise indicating the completion of the operation.
 */
const addMultipleMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId, userIds } = req.body;

    if (!teamId || !Array.isArray(userIds)) {
      res.status(400).json({
        error:
          "Invalid request. Please provide teamId and an array of userIds.",
      });
      return;
    }

    for (const userId of userIds) {
      const isUserActive = await userInformation.findOne({
        where: {
          id: userId,
          status: "active",
        },
      });

      if (!isUserActive) {
        res.status(400).json({
          error: `User with ID ${userId} is not active`,
        });
        return;
      }
    }

    const teamMembersData = userIds.map((userId: number) => ({
      userId,
      teamId,
      roleId: "5",
      status: "active",
    }));

    const newTeamMembers = await teamMemberInformation.bulkCreate(
      teamMembersData
    );

    const teamMembers = await teamMemberInformation.findAll({
      where: { userId: userIds },
      include: [
        {
          model: userInformation,
          attributes: ['givenName', 'email'],
        },
        {
          model: teamInformation,
          attributes: ['teamName'],
        },
      ],
    });


    const users = teamMembers.map((teamMember) => ({
      name: teamMember.userInformation.givenName,
      email: teamMember.userInformation.email,
      teamName: teamMember.teamInformation.teamName,
    }));

    sendEmailNotification("teamMemberAdded",users)


    res.status(201).json({
      message: "Team members inserted successfully",
      data: newTeamMembers.map((teamMember) => teamMember.toJSON()),
    });
  } catch (error) {
    console.error("Error inserting team members:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
};

export default addMultipleMembers;
