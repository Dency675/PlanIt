import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";

const getAllTeamManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = 2; 

    const userRoleMappings = await EmployeeRoleMapping.findAll({
      where: { roleId: roleId },
      attributes: ["userId"], 
    });

    const userIds = userRoleMappings.map((mapping) => mapping.userId);

    const users = await UserInformation.findAll({
      where: { id: userIds, status: 'active' },
      include: [
        {
          model: EmployeeRoleMapping,
          where: { roleId: roleId },
          required: false 
        }
      ]
    });

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res.status(200).json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllTeamManager;
