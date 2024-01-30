import { Request, Response } from 'express';
import teamInformation from '../../models/teamInformation';

const getAllTeamInformation = async (req: Request, res: Response) => {
    try {
        const teamInfoList = await teamInformation.findAll();

        if (teamInfoList.length > 0) {
            return res.status(200).json({ teamInfoList });
        } else {
            return res.status(404).json({ message: 'No team information found' });
        }
    } catch (error) {
        console.error('Error fetching team information:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default getAllTeamInformation;
