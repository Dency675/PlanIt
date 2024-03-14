import express, { Request, Response } from "express";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import Roles from "../../models/roles";

const updateUserRoleToProjectManager = async (req: Request, res: Response) => {
  const user_id = req.params.id;

  try {
    const projectManagerRole = await Roles.findOne({
      where: { role_name: "project manager" },
    });

    if (!projectManagerRole) {
      return res.status(404).json({ error: "Project manager role not found" });
    }

    let employeeRoleMapping = await EmployeeRoleMapping.findOne({
      where: { user_id },
    });

    if (!employeeRoleMapping) {
      return res
        .status(404)
        .json({ error: "Employee role mapping not found for the user" });
    }

    employeeRoleMapping.roleId = projectManagerRole.id;
    await employeeRoleMapping.save();

    return res.status(200).json({ message: "User role updated successfully " });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default updateUserRoleToProjectManager;
