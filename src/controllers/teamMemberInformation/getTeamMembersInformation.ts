import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";


const getActiveTeamMembers = async (req: Request, res: Response) => {
  try {
    const { team_id } = req.body;

    if (!team_id) {
      return res.status(400).json({ error: 'teamId is required in the request body' });
    }

    const activeTeamMembers = await teamMemberInformation.findAll({
      where: { team_id: team_id, status: 'active' },attributes:[],
      include: [
        {
          model: userInformation,
          where: { status: 'active' },
          attributes: ['name'] 
        }
      ]
    });

    res.status(200).json({ activeTeamMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default getActiveTeamMembers;
