import { WebSocket } from "ws";
import { Connector } from "./Connector";
import {
  WsChannelType,
  Actions,
  Payload,
  Message,
  User,
} from "../common/types";
import { ChatClient } from "@twurple/chat/lib";
import { MessagePipeline } from "./messagePipeline/MessagePipeline";
import { UserPipeline } from "./userPipeline/UserPipeline";
import { EventSubListener } from "@twurple/eventsub/lib";
import { HelixUser } from "@twurple/api/lib";


const wsHandler = <T extends WsChannelType, A extends Actions<T>>(
  channel: T,
  action: A,
  callback: (ws:WebSocket, message: Payload<typeof channel, typeof action>) => void
) => {
  return {
    channel,
    action,
    callback
  };
};


type TwurpleActions = 'onMessage' | 'onMessageRemove';
const chatHandler = <T extends TwurpleActions>(action: T, callback:  Parameters<ChatClient[typeof action]>[0]) => {
  return {
    action,
    callback
  }
}

type EventSubAction = 'subscribeToChannelRedemptionAddEvents' | 'subscribeToChannelFollowEvents' | 
  'subscribeToChannelSubscriptionEvents' | 'subscribeToChannelSubscriptionMessageEvents' | 'subscribeToChannelSubscriptionGiftEvents';

const eventSubHandler = <T extends EventSubAction>(action:T, callback: Parameters<EventSubListener[typeof action]>[1]) => {
  return {
    action,
    callback
  }
};


export class TwichatMain {
  private resetFocusTimer: NodeJS.Timeout = null;
  private WebSocketHandlers = [
    wsHandler("host", "messageSelect", (_, payload) => {
      console.log("broadcast", payload);
      const message = this.messages.find((m) => m.id === payload.id);
      if (message) {
        this.connector.broadcast("focus", "messageFocus", {
          message,
          user: this.users[message.userId],
        });
        clearTimeout(this.resetFocusTimer);
        this.resetFocusTimer = setTimeout(() => {
          this.connector.broadcast("focus", "messageUnfocus", {});
        }, 60 * 1000);
      }
    }),
    wsHandler("host", "messageLike", (_, payload) => {
      const message = this.messages.find((m) => m.id === payload.id);
      message.isLiked = true;
      this.connector.broadcast("chat", "messageLike", payload);
    }),
    wsHandler("host", "messageUnselect", (_, __) => {
      this.connector.broadcast("focus", "messageUnfocus", {});
      clearTimeout(this.resetFocusTimer);
    }),
  ] as const;

  private ChatClientHandlers = [
    chatHandler("onMessage", (_, __, ___, msg) => {
      const { userInfo } = msg;

      const user = this.userPipeline.transform(userInfo);

      this.users[user.id] ??= user;
      const message: Message = this.messagePipeline.transform(msg);

      this.messages.push(message);

      this.connector.broadcast("chat", "newMessage", {
        user,
        message,
      });
    }),
    chatHandler("onMessageRemove", (_, messageId) => {
      this.connector.broadcast("chat", "messageRemove", {
        id: messageId,
      });
    }),
  ] as const;

  private EventSubHandlers = [
    eventSubHandler("subscribeToChannelRedemptionAddEvents", async (data) => {
      console.log('reward', data.rewardTitle, data.input, data.id);
      const user = await data.getUser();
      this.connector.broadcast("announcements", "rewardRedemption", {
        userName: user.displayName,
        title: data.rewardTitle,
        input: data.input,
        id: data.id
      });
    }),
    eventSubHandler("subscribeToChannelFollowEvents", async (data) => {
      console.log('follow', data.userDisplayName );
      this.connector.broadcast("announcements", "newFollow", {
        userName: data.userDisplayName,
        id: data.followDate.getTime().toString()
      });
    }),
    eventSubHandler("subscribeToChannelSubscriptionEvents", async (data) => {
      this.connector.broadcast("announcements", "newSub", {
        userName: data.userDisplayName,
        id: data.userId,
        tier: data.tier,
        isGift: data.isGift
      })
    }),
    eventSubHandler("subscribeToChannelSubscriptionGiftEvents", async (data) => {
      this.connector.broadcast("announcements", 'giftSub', {
        id: Date.now().toString(),
        userName: data.gifterDisplayName,
        isAnonymous: data.isAnonymous,
        amount: data.amount,
        cumulativeAmount: data.cumulativeAmount,
        tier: data.tier
      })
    })
  ] as const;

  private messages: Message[] = [];
  private users: Record<string, User> = {};

  constructor(
    user: HelixUser,
    private connector: Connector,
    chatClient: ChatClient,
    eventSubListener: EventSubListener,
    private userPipeline: UserPipeline,
    private messagePipeline: MessagePipeline
  ) {
    this.WebSocketHandlers.forEach((handler) => {
      this.connector.onMessage(
        handler.channel,
        handler.action,
        handler.callback
      );
    });

    this.ChatClientHandlers.forEach((handler) => {
      //@ts-ignore
      chatClient[handler.action](handler.callback);
    });

    this.EventSubHandlers.forEach(async (handler) => {
      //@ts-ignore
      const subscriber = await eventSubListener[handler.action](user, handler.callback);
      const cliTest = await subscriber.getCliTestCommand();
      console.log(handler.action, cliTest);
    });
  }
}
