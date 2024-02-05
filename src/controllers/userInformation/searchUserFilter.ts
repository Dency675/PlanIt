import { Request, Response } from "express";
import { Op } from "sequelize";
import user_information from "../../models/userInformation";

export const searchUserFilter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { offset, search } = req.query;
    let { userList } = req.body;

    let searchString = search;
    if (typeof searchString === "string") {
      searchString = searchString.trim();
    }

    let skip: number = 0;
    if (offset) {
      skip = parseInt(offset as string);
    }

    const excludedEmails = userList.map((user: any) => user.email);

    const userResults = await user_information.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { givenName: { [Op.like]: `%${searchString}%` } },
              { email: { [Op.like]: `%${searchString}%` } },
            ],
          },
          {
            email: { [Op.notIn]: excludedEmails },
          },
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
