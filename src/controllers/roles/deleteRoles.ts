import { Request, Response, Router } from "express";
import roles from "../../models/roles";

const deleteRoles = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

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
