import { Model } from "sequelize";

class userStorySessionMapping extends Model {
  [x: string]: any;
  public id!: number;
  public userStoryId!: number;
  public sessionId!: number;
  public roundNumber!: number;
  public comment?: Text;
  public storyPointResult!: number;
}

export default userStorySessionMapping;
