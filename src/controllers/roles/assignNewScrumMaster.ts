import express, { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import roles from "../../models/roles";
import e from "express";
import { error } from "console";
import sequelize from "../../config/sequelize";

const assignNewScrumMaster = async (req: Request, res: Response) => {
  try {
    const teamMemberId = parseInt(req.query.teamMemberId as string);

    // Validate team member ID
    if (isNaN(teamMemberId)) {
      return res.status(400).json({ error: "Invalid team member ID" });
    }

    // Find the team member by id
    const teamMember = await teamMemberInformation.findByPk(teamMemberId);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }

    const updationTransaction = await sequelize.transaction();
    // Find the roles
    const [scrumMasterRole, developerRole] = await Promise.all([
      roles.findOne({
        where: { role_name: "scrum master" },
        transaction: updationTransaction,
      }),
      roles.findOne({
        where: { role_name: "developer" },
        transaction: updationTransaction,
      }),
    ]);
    if (!scrumMasterRole || !developerRole) {
      return res.status(500).json({ error: "Roles not found" });
    }

    // Update roles
    const updated = await Promise.all([
      teamMemberInformation.update(
        { roleId: developerRole.id },
        {
          where: { teamId: teamMember.teamId, roleId: scrumMasterRole.id },
          transaction: updationTransaction,
        }
      ),
      teamMemberInformation.update(
        { roleId: scrumMasterRole.id },
        { where: { id: teamMemberId }, transaction: updationTransaction }
      ),
    ]);

    updationTransaction.commit();
    if (updated) {
      console.log("updated is", updated);
      res.status(200).json({ message: "Role updated successfully" });
    } else {
      updationTransaction.rollback();
      throw new Error("not updated!");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default assignNewScrumMaster;
