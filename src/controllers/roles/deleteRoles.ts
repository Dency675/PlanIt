import { Request, Response, Router } from "express";
import roles from "../../models/roles";

/**
 * Deletes a role from the roles model by its unique identifier (id).
 *
 * @param {Request} req - Express Request object containing the role id.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<void>} - A JSON response indicating the success or failure of the deletion operation.
 */

const deleteRoles = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(422).json({
        error: "id is missing",
      });
    }

    const value = await roles.destroy({ where: { id: id } });
    if (value > 0) {
      res.status(200).json(`Role no. ${id} has been successfully deleted`);
    } else {
      res.status(404).send("Error!\nRole not found...");
    }
  } catch (error) {
    res.status(500).send("Internal server error!").json({ error: error });
  }
};
export default deleteRoles;
