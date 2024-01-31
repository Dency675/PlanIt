import { Request, Response } from 'express';
import teamInformation from '../../models/teamInformation';

const editTeamInformation = async (req: Request, res: Response) => {
    try {
        const { team_name, status } = req.body;
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const [updatedRowsCount] = await teamInformation.update(
            { team_name, status },
            { where: { id } }
        );

        if (updatedRowsCount > 0) {
            const updatedRows = await teamInformation.findOne({ where: { id } });
            return res.status(200).json({ message: 'Team information updated successfully', teamInfo: updatedRows });
        } else {
            return res.status(404).json({ message: 'ID not found' });
        }
    } catch (error) {
        console.error('Error updating team information:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default editTeamInformation;
