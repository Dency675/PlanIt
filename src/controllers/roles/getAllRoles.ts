import { Request, Response, Router } from "express";
import roles from "../../models/roles";

const getAllRoles = async (req: Request, res: Response) => {
  try {
    const value = await roles.findAll();
    if (value) {
      res.status(200).json(value);
    } else {
      res.status(404).send("Error!\nRole not found...");
    }
  } catch (error) {
    res.status(500).send("Internal server error!").json({ error: error });
  }
};

export default getAllRoles;
