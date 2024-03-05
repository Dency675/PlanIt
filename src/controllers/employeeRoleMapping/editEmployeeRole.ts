import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
import { sendEmailNotification } from "../email/send_mail";

/**
 * Edits the role of an employee by updating the employee role mapping.
 *
 * @param {Request} req - Express Request object containing user ID, old role ID, and new role ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of updating the employee role.
 */

const editEmployeeRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, oldRoleId, newRoleId } = req.body;

    if (!userId || !oldRoleId || !newRoleId) {
      failure(
        res,
        400,
        null,
        "User ID, Old Role ID, and New Role ID are required"
      );
      return;
    }

    const user = await UserInformation.findByPk(userId);
    const oldRole = await Role.findByPk(oldRoleId);
    const newRole = await Role.findByPk(newRoleId);

    if (!user || !oldRole || !newRole) {
      failure(res, 404, null, "User, Old Role, or New Role not found");
      return;
    }

    const employeeRole = await EmployeeRoleMapping.findOne({
      where: { userId: userId, roleId: oldRoleId },
    });

    if (!employeeRole) {
      failure(res, 404, null, "Employee role mapping not found");
      return;
    }

    employeeRole.roleId = newRoleId;
    await employeeRole.save();

    if (newRoleId === 2) {
      const newProjectManager = await UserInformation.findOne({
        where: { id: userId },
        attributes: ["givenName", "email"],
      });

      if (!newProjectManager) {
        throw new Error("Team member information not found");
      }

      const newProjectManagerInfo = [
        {
          name: newProjectManager.givenName,
          email: newProjectManager.email,
        },
      ];

      sendEmailNotification("projectManagerAdded", newProjectManagerInfo);
    }

    success(res, 200, {
      message: "Employee role updated successfully",
      data: employeeRole,
    });
  } catch (error) {
    console.error("Error updating employee role:", error);
    failure(res, 500, null, "Internal Server Error");
  }
};

export default editEmployeeRole;
