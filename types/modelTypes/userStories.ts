import { Model } from "sequelize";

class userStories extends Model {
  public id!: number;
  public user_story!: Text;
}

export default userStories;
