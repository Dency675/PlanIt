import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";

const editEmployeeRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, oldRoleId, newRoleId } = req.body;

    if (!userId || !oldRoleId || !newRoleId) {
      res
        .status(400)
        .json({ error: "User ID, Old Role ID, and New Role ID are required" });
      return;
    }

    const user = await UserInformation.findByPk(userId);
    const oldRole = await Role.findByPk(oldRoleId);
    const newRole = await Role.findByPk(newRoleId);

    if (!user || !oldRole || !newRole) {
      res.status(404).json({ error: "User, Old Role, or New Role not found" });
      return;
    }

    const employeeRole = await EmployeeRoleMapping.findOne({
      where: { userId: userId, roleId: oldRoleId },
    });

    if (!employeeRole) {
      res.status(404).json({ error: "Employee role mapping not found" });
      return;
    }

    employeeRole.roleId = newRoleId;
    await employeeRole.save();

    res.status(200).json({
      message: "Employee role updated successfully",
      data: employeeRole,
    });
  } catch (error) {
    console.error("Error updating employee role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default editEmployeeRole;
