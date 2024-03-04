import { Request, Response, Router } from "express";
import roles from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Retrieves a role from the roles model by its unique identifier (id).
 *
 * @param {Request} req - Express Request object containing the role id.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response containing the requested role or an error message along with the appropriate status code.
 */

const getRoleByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return failure(res, 422, null, "id is missing");
    }

    const value = await roles.findOne({
      where: { id: id },
    });
    if (value) {
      return success(res, 200, value, "Role found");
    } else {
      return failure(res, 404, null, "Role not found");
    }
  } catch (error) {
    return failure(res, 500, error, "Internal server error!");
  }
};

export default getRoleByID;
