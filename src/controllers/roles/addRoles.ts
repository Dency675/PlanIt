import { Request, Response } from "express";
import roles from "../../models/roles";

const addRoles = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roleName } = req.body;

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
