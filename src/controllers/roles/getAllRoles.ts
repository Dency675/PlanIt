import { Request, Response, Router } from "express";
import roles from "../../models/roles";

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
      res.status(200).json(value);
    } else {
      res.status(404).send("Error!\nRole not found...");
    }
  } catch (error) {
    res.status(500).send("Internal server error!").json({ error: error });
  }
};

export default getAllRoles;
