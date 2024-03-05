import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
/**
 * Retrieves all roles of a user based on the user ID from the EmployeeRoleMapping table.
 *
 * @param {Request} req - Express Request object containing the user ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response containing the roles associated with the user.
 */

const getAllRolesOfUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string | undefined = req.params.id as string;

    if (!userId) {
      failure(res, 400, null, "User ID is required");
      return;
    }

    const user = await UserInformation.findByPk(userId);

    if (!user) {
      failure(res, 404, null, "User not found");
      return;
    }

    const userRoleMappings = await EmployeeRoleMapping.findAll({
      where: { userId: userId },
      raw: true,
    });

    if (!userRoleMappings || userRoleMappings.length === 0) {
      failure(res, 404, { message: "No roles found for the user" });
      return;
    }

    const roleIds = userRoleMappings.map((mapping) => mapping.roleId);

    const roles = await Role.findAll({
      where: { id: roleIds },
      attributes: ["roleName"],
      raw: true,
    });

    if (!roles || roles.length === 0) {
      failure(res, 404, { message: "No roles found for the user" });
      return;
    }

    const roleNames = roles.map((role) => role.roleName);

    success(res, 200, {
      message: "Roles retrieved successfully",
      data: roleNames,
    });
  } catch (error) {
    console.error("Error retrieving roles of user:", error);
    failure(res, 500, null, "Internal Server Error");
  }
};

export default getAllRolesOfUser;
