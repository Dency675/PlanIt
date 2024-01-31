import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";

const addTeamMemberInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, teamId, roleId, status } = req.body;

    if (!userId || !teamId || !roleId || !status) {
      res.status(400).json({
        error: "Missing required fields in request body",
      });
      return;
    }

    const newTeamMember = await teamMemberInformation.create({
      userId,
      teamId,
      roleId,
      status,
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
