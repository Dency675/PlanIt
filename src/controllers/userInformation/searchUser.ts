import { Request, Response } from "express";
import { Op } from "sequelize";
import user_information from "../../models/userInformation";

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { search } = req.query;

    if (typeof search === "string") {
      search = search.trim();
    }


    const userResults = await user_information.findAll({
      where: {
        [Op.or]: [
          { givenName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
    });

    res.status(200).json({ userResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
