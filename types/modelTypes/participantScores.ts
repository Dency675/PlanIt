import { Model } from "sequelize";

class participantScores extends Model {
  public id!: number;
  public teamMemberId!: number;
  public userStorySessionMappingId!: number;
  public storyPoint!: string;
}

export default participantScores;
