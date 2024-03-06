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
      return res.status(422).json({
        error: "id is missing",
      });
    }

    const value = await roles.findOne({
      where: { id: id },
    });
    if (value) {
      res.status(200).json(value);
    } else {
      res.status(404).send("Error!\nRole not found...");
    }
  } catch (error) {
    res.status(500).send("Internal server error!").json({ error: error });
  }
};

export default getRoleByID;
