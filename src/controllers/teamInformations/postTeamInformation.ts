import { Request, Response } from 'express';
import teamInformation from '../../models/teamInformation';

const addTeamInformation = async (req: Request, res: Response) => {
    try {
        const { teamName, status } = req.body;

        if (!teamName || !status) {
            return res.status(400).json({ error: 'Team name and status are required' });
        }

        const teamInfo = await teamInformation.create({ teamName, status });

        return res.status(201).json({ message: 'Team information added successfully', teamInfo });
    } catch (error) {
        console.error('Error adding team information:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default addTeamInformation;
