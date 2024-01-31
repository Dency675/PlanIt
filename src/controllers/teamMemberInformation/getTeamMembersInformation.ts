import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";

/**
 * Handles the retrival of Team members information.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */
const getActiveTeamMembers = async (req: Request, res: Response) => {
  try {
    const { team_id } = req.body;
    if (!team_id) {
      return res.status(400).json({ error: 'teamId is required in the request body' });
    }
    const activeTeamMembers = await teamMemberInformation.findAll({
      where: { teamId: team_id, status: 'active' },
      attributes: [],
      include: [
        {
          model: userInformation,
          where: { status: 'active' },
          attributes: ['givenName']
        }
      ]
    });

    if (!activeTeamMembers || activeTeamMembers.length === 0) {
      return res.status(404).json({ error: 'No active team members found for the given teamId' });
    }

    res.status(200).json({ activeTeamMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default getActiveTeamMembers;
