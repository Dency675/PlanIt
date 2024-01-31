import { Model } from "sequelize";

class SessionParticipants extends Model {
  [x: string]: any;

  public id!: number;
  public sessionId!: number;
  public userId!: string;
  public roleId!: number;
  public isJoined!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default SessionParticipants;
