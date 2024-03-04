import { Request, Response } from "express";
import teamInformation from "../../models/teamInformation";

const getATeamInformation = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const teamInfo = await teamInformation.findOne({ where: { id } });

    if (teamInfo) {
      return res.status(200).json({ teamInfo });
    } else {
      return res.status(404).json({ message: "Team information not found" });
    }
  } catch (error) {
    console.error("Error fetching team information:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getATeamInformation;
