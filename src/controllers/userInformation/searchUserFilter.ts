import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import userInformation from "../../models/userInformation";
import teamMemberInformation from "../../models/teamMemberInformation";

export const searchUserFilter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { offset, search } = req.query;
    // let { userList } = req.body;
    let { teamId } = req.body;
    
    // Trim the search query if it's a string
    let searchString = search;
    if (typeof searchString === "string") {
      searchString = searchString.trim();
    }

    let skip: number = 0;
    if (offset) {
      skip = parseInt(offset as string);
    }

    // Query team members based on team_id
    const teamMembers = await teamMemberInformation.findAll({
      where: { team_id: teamId },
      attributes: ['user_id'],
    });
  
    // Extract user IDs from team members
    const userIds: string[] = teamMembers.map((member) => member.getDataValue("user_id"));

    // Query users not in the team and retrieve their emails
    const excludedUsers = await userInformation.findAll({
      where: { id: { [Op.in]: userIds } },
      attributes: ['email'],
    });
    const excludedEmails: string[] = excludedUsers.map((member) => member.getDataValue("email"));

    // Search for users by name excluding users in the userList
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
