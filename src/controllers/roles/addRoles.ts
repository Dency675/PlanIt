import { Request, Response } from "express";
import roles from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Handles the creation of a new role in the roles model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */

const addRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return failure(res, 422, null, "role Name is missing");
    }

    const roleData = await roles.create(
      {
        roleName: roleName,
      },
      { raw: true }
    );

    return success(res, 201, roleData, "Role created.");
  } catch (error) {
    return failure(res, 500, null, "Internal server error!");
  }
};

export default addRoles;
