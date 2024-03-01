export interface UserData {
  userName: string;
  roleId: number;
  teamMemberId: number;
  score: {
    userStorySessionMappingId: number;
    storyPoint: string;
  }[];
}
