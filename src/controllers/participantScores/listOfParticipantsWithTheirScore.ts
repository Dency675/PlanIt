import { Request, Response } from "express";
import userInformation from "../../models/userInformation";
import participantScores from "../../models/participantScores";
import SessionParticipants from "../../models/sessionParticipants";
import teamMemberInformation from "../../models/teamMemberInformation";
import sessions from "../../models/sessions";
import { Op } from "sequelize";

const listOfParticipantsWithTheirScore = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;

        // Check if session exists
        const enteredSession = await sessions.findByPk(sessionId);
        if (!enteredSession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get teamId from the entered session
        const teamId = enteredSession.teamId;

        // Find participants who have joined the session and have roleId 5 (assuming 5 is the roleId for developers)
        const participants = await SessionParticipants.findAll({
            where: {
                sessionId: sessionId,
                isJoined: true,
                roleId: 5,
            },
            attributes: ['userId'],
        });
        const userIds = participants.map(participant => participant.userId);

        // Find team member information for the participants
        const teamMemberIds = await teamMemberInformation.findAll({
            where: {
                teamId: teamId,
                userId: { [Op.in]: userIds },
            },
            attributes: ['id'],
            include: [
                {
                    model: userInformation,
                    attributes: ['givenName'],
                },
            ],
        });

        // Transform team member information
        const transformedTeamMember = teamMemberIds.map(member => ({
            id: member.id,
            givenName: member.userInformation.givenName,
        }));

        // Get team member ids
        const transformedTeamMemberIds = transformedTeamMember.map(member => member.id);

        // Find scores for the team members
        const scores = await participantScores.findAll({
            attributes: ['storyPoint'],
            include: [
                {
                    model: teamMemberInformation,
                    where: { id: { [Op.in]: transformedTeamMemberIds } },
                    attributes: ['id'],
                },
            ],
        });

        // Transform scores
        const transformedScores = scores.map(member => ({
            storyPoint: member.storyPoint,
            id: member.teamMemberInformation.id,
        }));

        // Combine results
        const combinedResult = transformedTeamMember.map(member => {
            const score = transformedScores.find(score => score.id === member.id);
            return { givenName: member.givenName, storyPoint: score ? score.storyPoint : null };
        });

        // Return combined result
        res.status(200).json({ combinedResult });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default listOfParticipantsWithTheirScore;
