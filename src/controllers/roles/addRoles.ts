import { Request, Response } from "express";
import roles from "../../models/roles";

/**
 * Handles the creation of a new role in the roles model.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */

const addRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roleName } = req.body;

    if (!roleName) {
      return res.status(422).json({
        error: "roleName is missing",
      });
    }

    const createRoles = await roles.create(
      {
        roleName: roleName,
      },
      { raw: true }
    );

    return res
      .status(201)
      .json({ message: `role created.`, data: createRoles });
  } catch (error) {
    return res
      .status(500)
      .send("Internal server error!")
      .json({ error: error });
  }
};

export default addRoles;
