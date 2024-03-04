import { Request, Response, Router } from "express";
import roles from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Retrieves all roles from the roles model.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response containing all roles or an error message along with the appropriate status code.
 */

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const value = await roles.findAll();

    if (value && value.length > 0) {
      return success(res, 200, value, "All Roles");
    } else {
      return failure(res, 404, null, "Role not found");
    }
  } catch (error) {
    return failure(res, 500, error, "Internal server error!");
  }
};

export default getAllRoles;
