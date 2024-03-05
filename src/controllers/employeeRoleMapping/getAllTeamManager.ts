import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import UserInformation from "../../models/userInformation";
import Role from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
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
      where: { id: userIds, status: "active" },
      include: [
        {
          model: EmployeeRoleMapping,
          where: { roleId: roleId },
          required: false,
        },
      ],
    });

    if (!users || users.length === 0) {
      failure(res, 404, { message: "No users found" });
      return;
    }

    success(res, 200, { message: "Users retrieved successfully", data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    failure(res, 500, null, "Internal Server Error");
  }
};

export default getAllTeamManager;
