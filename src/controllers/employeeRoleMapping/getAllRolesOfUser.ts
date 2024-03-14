import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";

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

    // Validate input
    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    // Check if user exists
    const user = await UserInformation.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get all roles of the user from EmployeeRoleMapping table
    const userRoleMappings = await EmployeeRoleMapping.findAll({
      where: { userId: userId },
      raw: true,
    });

    if (!userRoleMappings || userRoleMappings.length === 0) {
      res.status(404).json({ message: "No roles found for the user" });
      return;
    }

    // Extract roleId's
    const roleIds = userRoleMappings.map((mapping) => mapping.roleId);

    // Get role names from Roles table
    const roles = await Role.findAll({
      where: { id: roleIds },
      attributes: ["roleName"],
      raw: true,
    });

    if (!roles || roles.length === 0) {
      res.status(404).json({ message: "No roles found for the user" });
      return;
    }

    const roleNames = roles.map((role) => role.roleName);

    res
      .status(200)
      .json({ message: "Roles retrieved successfully", data: roleNames });
  } catch (error) {
    console.error("Error retrieving roles of user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllRolesOfUser;
