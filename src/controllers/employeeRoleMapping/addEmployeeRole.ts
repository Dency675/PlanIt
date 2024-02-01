import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";

/**
 * Adds a new employee role mapping for a user.
 *
 * @param {Request} req - Express Request object containing user ID and role ID.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of adding the employee role.
 */

const addEmployeeRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId) {
      res.status(400).json({ error: "User ID and Role ID are required" });
      return;
    }

    const user = await UserInformation.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      res.status(404).json({ error: "User or Role not found" });
      return;
    }

    const employeeRole = await EmployeeRoleMapping.create({
      userId: userId,
      roleId: roleId,
    });

    res.status(201).json({
      message: "Employee role added successfully",
      data: employeeRole,
    });
  } catch (error) {
    console.error("Error adding employee role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default addEmployeeRole;
