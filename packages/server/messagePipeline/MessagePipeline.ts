import { TwitchPrivateMessage } from "@twurple/chat/lib/commands/TwitchPrivateMessage";
import { Message } from "../../common/types";

export interface IMessageTransformer {
  isReady(): boolean;
  transform(message: Message): Message 
}

export class MessagePipeline {
  constructor(private integrations: IMessageTransformer[]) {
  }

  private createMessage(msg: TwitchPrivateMessage, isFirstToday: boolean): Message {
    const { userInfo, id } = msg;
    return {
        userId: userInfo.userId,
        id: id,
        isFirstToday,
        content: msg.parseEmotes().map((content) => {
          if (content.type === "emote") {
            return {
              type: content.type,
              emoteUrl: content.displayInfo.getUrl({
                size: "3.0",
                backgroundType: "dark",
                animationSettings: "default",
              }),
            };
          }
          if (content.type === "text") {
            return {
              type: content.type,
              text: content.text,
            };
          }
        }),
    }
  }

  transform(message: TwitchPrivateMessage, isFirstToday = false): Message {
    let cur = this.createMessage(message, isFirstToday);

    for (let integraion of this.integrations) {
      if (integraion.isReady()) {
        cur = integraion.transform(cur);
      }
    }

    return cur;
  }
}
