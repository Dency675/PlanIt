import express, { Request, Response } from 'express';
import teamMemberInformation from '../../models/teamMemberInformation';
import roles from '../../models/roles';
import e from 'express';

const assignNewScrumMaster=  async (req: Request, res: Response) => {
  try {
    const teamMemberId = parseInt(req.query.teamMemberId as string);

    // Validate team member ID
    if (isNaN(teamMemberId)) {
      return res.status(400).json({ error: 'Invalid team member ID' });
    }

    // Find the team member by id
    const teamMember = await teamMemberInformation.findByPk(teamMemberId);
    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Find the roles
    const [scrumMasterRole, developerRole] = await Promise.all([
      roles.findOne({ where: { role_name: 'scrum master' } }),
      roles.findOne({ where: { role_name: 'developer' } }),
    ]);
    if (!scrumMasterRole || !developerRole) {
      return res.status(500).json({ error: 'Roles not found' });
    }

    // Update roles
    await Promise.all([
      teamMemberInformation.update(
        { roleId: developerRole.id },
        { where: { teamId: teamMember.teamId, roleId: scrumMasterRole.id } }
      ),
      teamMemberInformation.update(
        { roleId: scrumMasterRole.id },
        { where: { id: teamMemberId } }
      ), 
    ]
    );
    
    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default assignNewScrumMaster;
