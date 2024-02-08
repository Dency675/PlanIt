import { Request,Response } from "express";
import teamMemberInformation from "../../models/teamMemberInformation";
import teamInformation from "../../models/teamInformation";
import userInformation from "../../models/userInformation";

const getTeamInformationByUserId = async (req:Request,res:Response) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required in the request body' });
      }

      const teamInfoList = await  teamMemberInformation.findAll({
        include: [
          { model: teamInformation ,
            where: { status: 'active' },
            attributes: ['id', 'team_name'],
          },
          { model: userInformation ,
            where: { id: userId, status: 'active' },
            attributes: []
          }
        ],
        where: { status: 'active' },
        attributes: [],
        raw: true,
      });

      if(!teamInfoList.length){
        return res.status(204).send('No Content');
      }
  
      res.status(200).json({teamInfoList});

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

export default getTeamInformationByUserId;