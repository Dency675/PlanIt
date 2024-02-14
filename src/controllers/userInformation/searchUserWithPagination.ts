import { Request, Response } from "express";
import { Op } from "sequelize";
import user_information from "../../models/userInformation";

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { offset, search } = req.query;

    if (typeof search === "string") {
      search = search.trim();
    }

    let skip: number = 0;
    if (offset) {
      skip = parseInt(offset as string);
    }

    const userResults = await user_information.findAll({
      where: {
        [Op.or]: [
          { givenName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
      limit: 10,
      offset: skip,
    });

    res.status(200).json({ userResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
