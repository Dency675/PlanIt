import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";

const getAllTeamManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roleId = 2; // Role ID to filter by

    // Find user IDs from EmployeeRoleMapping table where roleId is 2
    const userRoleMappings = await EmployeeRoleMapping.findAll({
      where: { roleId: roleId },
      attributes: ["userId"], // Select only userId
    });

    // Extract userIds from userRoleMappings
    const userIds = userRoleMappings.map((mapping) => mapping.userId);

    // Find user information for the extracted userIds with status 'active'
    const users = await UserInformation.findAll({
      where: { id: userIds, status: "active" },
      include: [
        {
          model: EmployeeRoleMapping,
          where: { roleId: roleId },
          required: false, // Use left join to include all users
        },
      ],
    });

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllTeamManager;
