import { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import Roles from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";
const updateUserRoleToProjectManager = async (req: Request, res: Response) => {
  const user_id = req.params.id;

  try {
    const projectManagerRole = await Roles.findOne({
      where: { role_name: "project manager" },
    });

    if (!projectManagerRole) {
      return failure(res, 404, { error: "Project manager role not found" });
    }

    let employeeRoleMapping = await EmployeeRoleMapping.findOne({
      where: { user_id },
    });

    if (!employeeRoleMapping) {
      return failure(res, 404, {
        error: "Employee role mapping not found for the user",
      });
    }

    employeeRoleMapping.roleId = projectManagerRole.id;
    await employeeRoleMapping.save();

    return success(res, 200, {
      message: "User role updated successfully",
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return failure(res, 500, { error: "Internal server error" });
  }
};

export default updateUserRoleToProjectManager;
