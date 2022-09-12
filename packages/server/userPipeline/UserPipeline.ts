import { ChatUser } from "@twurple/chat";
import { User } from "../../common/types";

export interface IUserTransformer {
  isReady(): boolean;
  transform(user: User, ogUserInfo: ChatUser): User;
}

export class UserPipeline {
  constructor(private integrations: IUserTransformer[]) {

  }


  transform(userInfo: ChatUser): User {
    let user = {
      id: userInfo.userId,
      name: userInfo.userName,
      color: userInfo.color || "#fff",
      isVip: userInfo.isVip,
      isMod: userInfo.isMod,
      isSubscriber: userInfo.isSubscriber,
      isFounder: userInfo.isFounder,
    };

    for (let integraion of this.integrations) {
      if (integraion.isReady()) {
        user = integraion.transform(user, userInfo);
      }
    }
    return user;
  }
}
