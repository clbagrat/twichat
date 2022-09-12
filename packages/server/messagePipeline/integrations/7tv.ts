import { Message } from "../../../common/types";
import { IMessageTransformer } from "../MessagePipeline";
import http from "https";

type SeventTvEmote = {
  name: string;
  url: string;
}

export class SevenTv implements IMessageTransformer {
  private _isReady = false;
  private allEmotes: Record<string, string> = {} 

  private requestEmotes(url: string) {
    let output = '';
    http.get(url, (res) => {
      res.on("data", (data) => {
        output += data;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(output);
          this.allEmotes = {
            ...this.allEmotes,
            ...parsed.reduce((acc: Record<string, string>, emote: any) => {
              acc[emote.name] = emote.urls[0][1];
              return acc;
            }, {}),
          };
          this._isReady = true;
        } catch {
          console.log("7tv not supported " + url);
        }
      });
    });

  }
  constructor(userApiUrl: string, globalApiUrl: string) {
    this.requestEmotes(userApiUrl);
    this.requestEmotes(globalApiUrl);
  }

  isReady(): boolean {
    return this._isReady;
  }

  transform(message: Message): Message {
    const newContent = message.content.reduce((acc, cur) => {
      if (cur.type === "text") {
        let replaces = cur.text
          .split(' ')
          .reduce((acc: Message["content"], curKey: string) => {
            let prev = acc.at(-1);
            let isEmote = this.allEmotes.hasOwnProperty(curKey);
            if (prev && prev.type === 'text' && !isEmote) {
              prev.text += ` ${curKey}`;
            } else if(!isEmote) {
              acc.push({
                type: "text",
                text: curKey,
              });
            } else {
              acc.push({
                type: "emote",
                emoteUrl: this.allEmotes[curKey]
              })
            }
            return acc;
          }, []);

        acc.push(...replaces);
      }

      if (cur.type === "emote") {
        acc.push(cur);
      }

      return acc;
    }, []);

    const newMessage = {
      ...message,
      content: newContent
    }
    return newMessage;
  }

}
