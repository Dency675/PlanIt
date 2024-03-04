import express, { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import roles from "../../models/roles";
import sequelize from "../../config/sequelize";
import { sendEmailNotification } from "../email/send_mail";
import userInformation from "../../models/userInformation";
import teamInformation from "../../models/teamInformation";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

const assignNewScrumMaster = async (req: Request, res: Response) => {
  try {
    const teamMemberId = parseInt(req.params.teamMemberId as string);

    if (isNaN(teamMemberId)) {
      return failure(res, 400, null, "Invalid team member ID");
    }

    const teamMember = await teamMemberInformation.findByPk(teamMemberId);
    if (!teamMember) {
      return failure(res, 404, null, "Team member not found");
    }

    const updationTransaction = await sequelize.transaction();
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
      return failure(res, 500, null, "Roles not found");
    }

    const newScrumMasterInfo = await teamMemberInformation.findOne({
      where: { id: teamMemberId },
      attributes: [],
      include: [
        {
          model: userInformation,
          attributes: ["givenName", "email"],
        },
        {
          model: teamInformation,
          attributes: ["teamName"],
        },
      ],
    });

    if (!newScrumMasterInfo) {
      throw new Error("Team member not found");
    }

    const newScrumMaster = [
      {
        name: newScrumMasterInfo.userInformation.givenName,
        email: newScrumMasterInfo.userInformation.email,
        teamName: newScrumMasterInfo.teamInformation.teamName,
      },
    ];

    const oldScrumMasterInfo = await teamMemberInformation.findOne({
      attributes: [],
      include: [
        {
          model: userInformation,
          attributes: ["givenName", "email"],
        },
        {
          model: teamInformation,
          where: { teamName: newScrumMasterInfo.teamInformation.teamName },
          attributes: ["teamName"],
        },
        {
          model: roles,
          where: { roleName: "scrum master" },
          attributes: [],
        },
      ],
    });
    let oldScrumMaster: { name: any; email: any; teamName: any }[] = [];
    if (oldScrumMasterInfo) {
      oldScrumMaster = [
        {
          name: oldScrumMasterInfo.userInformation.givenName,
          email: oldScrumMasterInfo.userInformation.email,
          teamName: oldScrumMasterInfo.teamInformation.teamName,
        },
      ];
    }

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
      sendEmailNotification("newScrumMaster", newScrumMaster);
      if (oldScrumMasterInfo) {
        sendEmailNotification("nolongerScrumMaster", oldScrumMaster);
      }
      return success(res, 200, null, "Role updated successfully");
    } else {
      updationTransaction.rollback();
      throw new Error("not updated!");
    }
  } catch (error) {
    console.error("Error:", error);
    return failure(res, 500, null, "Internal server error!");
  }
};

export default assignNewScrumMaster;
