import { Request, Response } from "express";
import userInformation from "../../models/userInformation";
import axios from "axios";
import EmployeeRoleMapping from "../../models/employeeRoleMapping";
import roles from "../../models/roles";
import { where } from "sequelize";

/**
 * Handles the creation of a new user Record in the user information table.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} A JSON response indicating the success or failure of the operation.
 */

const postUserInformation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const graphApiUrl =
      "https://graph.microsoft.com/v1.0/me?$select=department,id,givenName,surName,userPrincipalName,jobTitle";
    const graphApiResponse = await axios.get(graphApiUrl, {
      headers: {
        Authorization: `${req.headers.authorization}`,
      },
    });

    const employeeId = graphApiResponse.data.id;
    console.log(employeeId);

    const findUser = await userInformation.findOne({
      where: { employeeId: employeeId },
    });

    if (!findUser) {
      const userInformationAdd = await userInformation.create({
        department: graphApiResponse.data.department || "front-end",
        employeeId: graphApiResponse.data.id,
        givenName: graphApiResponse.data.givenName,
        surName: graphApiResponse.data.surname,
        userPrincipalName: graphApiResponse.data.userPrincipalName,
        email: graphApiResponse.data.userPrincipalName,
        jobTitle: graphApiResponse.data.jobTitle || "developer",
      });

      return res.status(200).json({
        message: "User information inserted successfully",
        data: userInformationAdd.toJSON(),
      });
    }

    const userId = findUser?.id;
    const findUserRoles = await EmployeeRoleMapping.findAll({
      where: { userId: userId },
      attributes: ["roleId"],
    });

    const rolesArray = findUserRoles.map((role) => role.roleId);

    if (rolesArray.length == 0) {
      return res.status(200).json({
        message: "User has no role assigned",
        roles: [],
      });
    }

    const roleNames = await roles.findAll({
      where: { id: rolesArray },
      attributes: ["role_name"],
    });

    return res.status(200).json({
      message: "User information already in the table",
      roles: roleNames,
      userId: userId,
    });
  } catch (error) {
    console.error("Error inserting user information:", error);
    return res.status(500).json({
      error: "Server Error",
    });
  }
};

export default postUserInformation;
