import { ApiClient } from "@twurple/api";
import { ChatUser } from "@twurple/chat/lib";
import { User } from "../../../common/types";
import { IUserTransformer } from "../UserPipeline";

export class TwitchBadges implements IUserTransformer {
  private _isReady: boolean = false;
  private badges: Record<string, Record<string, string>> = {}; 

  constructor(apiClient: ApiClient, channelName: string) {
    apiClient.users.getUserByName(channelName).then((user) => {
      Promise.all([
        apiClient.chat.getChannelBadges(user),
        apiClient.chat.getGlobalBadges(),
      ]).then(([userBadges, globalBadges]) => {
        userBadges.forEach((badge) => {
          this.badges[badge.id] = badge.versions.reduce(
            (acc: Record<string, string>, version) => {
              acc[version.id] = version.getImageUrl(2);
              return acc;
            },
            {}
          );
        });

        globalBadges.forEach((badge) => {
          this.badges[badge.id] ??= badge.versions.reduce(
            (acc: Record<string, string>, version) => {
              acc[version.id] = version.getImageUrl(2);
              return acc;
            },
            {}
          );
        });

        this._isReady = true;
      });
    });
  }

  public isReady() {
    return this._isReady;
  }

  public transform(user: User, ogUserInfo: ChatUser): User {
    if (!this._isReady) return user;
    user.badges ??= [];

    for (let [id, version] of ogUserInfo.badges) {
      user.badges.push({
        id,
        url: this.badges[id][version]
      })
    }
//    user.badges.push(...Array.from(ogUserInfo.badges).map(([id, version]) => {
//      return {
//        id,
//        url: this.badges[id][version]
//      }
//    }));
    return user;
  }
}
