import { Request, Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import userInformation from "../../models/userInformation";
import roles from "../../models/roles";
// import userInformation from "./../../../types/modelTypes/userInformation";

/**
 * Handles the retrieval of Team members information.
 *
 * @param {Request} req - Express Request object containing client data.
 * @param {Response} res - Express Response object for sending the server's response.
 * @returns {Promise<Response>} A JSON response indicating the success or failure of the operation.
 */
const getTeamMemberInformationByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { teamId, userId } = req.query;
    if (!teamId || !userId) {
      return res
        .status(400)
        .json({ error: "teamId and teamId are required in the request query" });
    }
    const activeTeamMembers = await teamMemberInformation.findAll({
      where: { teamId: teamId, status: "active" },
      attributes: ["id"],
      include: [
        {
          model: userInformation,
          where: { status: "active", id: userId },
          attributes: ["givenName", "id", "surName"],
        },
        {
          model: roles,
          attributes: ["roleName"],
        },
      ],
    });

    if (!activeTeamMembers || activeTeamMembers.length === 0) {
      return res
        .status(404)
        .json({ error: "No active team members found for the given teamId" });
    }

    const formattedActiveTeamMembers = activeTeamMembers.map((member: any) => ({
      teamMemberId: member.id,
      userGivenName:
        member.userInformation.givenName + " " + member.userInformation.surName,
      userId: member.userInformation.id,
      roleName: member.role.roleName,
    }));

    console.log(formattedActiveTeamMembers);

    res.status(200).json({ activeTeamMembers: formattedActiveTeamMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default getTeamMemberInformationByUserId;
