import { Request, Response } from "express";
import { Op } from "sequelize";
import userInformation from "../../models/userInformation";
import teamMemberInformation from "../../models/teamMemberInformation";

export const searchUserFilter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { offset, search } = req.query;
    let { teamId, userList } = req.body;

    let searchString = search;
    if (typeof searchString === "string") {
      searchString = searchString.trim();
    }

    let skip: number = 0;
    if (offset) {
      skip = parseInt(offset as string);
    }

    const teamMembers = await teamMemberInformation.findAll({
      where: { team_id: teamId },
      attributes: ["user_id"],
    });

    const userIds: string[] = teamMembers.map((member) =>
      member.getDataValue("user_id")
    );

    const excludedUsers = await userInformation.findAll({
      where: { id: { [Op.in]: userIds } },
      attributes: ["email"],
    });
    const excludedEmailss: string[] = excludedUsers.map((member) =>
      member.getDataValue("email")
    );

    const excludedEmailsss = userList.map((user: any) => user.email);

    const excludedEmails = [...excludedEmailss, ...excludedEmailsss];

    const userResults = await userInformation.findAll({
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
