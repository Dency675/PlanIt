import { Request, Response, Router } from "express";
import roles from "../../models/roles";

const editRoles = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const roleName = req.body.roleName;
    if (!roleName) {
      return res.status(400).send("Role name is missing or empty");
    }
    const updater = await roles.update(
      { roleName: roleName },
      { where: { id: id } }
    );
    if (updater[0] === 1) {
      res
        .status(200)
        .send(`Role no. ${id} has been sucessfully changed to: ${roleName}`);
    } else {
      res.status(404).send("Role is not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error!").json({ error: error });
  }
};

export default editRoles;
