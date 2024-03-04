import { Request, Response, Router } from "express";
import roles from "../../models/roles";
import { failure } from "../../helper/statusHandler/failureFunction";
import { success } from "../../helper/statusHandler/successFunction";

/**
 * Updates a role in the roles model by its unique identifier (id).
 *
 * @param {Request} req - Express Request object containing the role id and updated role name.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response indicating the success or failure of the update operation.
 */

const editRoles = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const roleName = req.body.roleName;

    if (!roleName) {
      return failure(res, 400, null, "Role name is missing or empty");
    }

    const updater = await roles.update(
      { roleName: roleName },
      { where: { id: id } }
    );

    if (updater[0] === 1) {
      return success(
        res,
        200,
        null,
        "Role no. ${id} has been sucessfully changed to: ${roleName}"
      );
    } else {
      return failure(res, 404, null, "Role is not found");
    }
  } catch (error) {
    return failure(res, 500, error, "Internal server error!");
  }
};

export default editRoles;
