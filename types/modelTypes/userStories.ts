import { Model } from "sequelize";

class userStories extends Model {
  public id!: number;
  public userStoryId!: Text;
  public user_story!: Text;
  public description!: Text;
  public issueKey!: Text;
}

export default userStories;
