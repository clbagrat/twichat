export type ClientEnvVars = {
  WS_URL: string
}

export type User = {
    name: string;
    id: string;
    color: string;
    isVip: boolean;
    isSubscriber: boolean;
    isFounder: boolean;
    isMod: boolean;
    badges?: Array<{
      id: string,
      url?:string
    }>;
};

type MessageContent = {
  type: 'text';
  text: string;
} | {
  type: 'emote';
  emoteUrl: string;
}

export type Message = {
  userId: string;
  id: string;
  isLiked?: boolean;
  content: MessageContent[]
}

type MessagePaylod = {
  user: User,
  message: Message
}

type DefaultPayload = {
  user: User;
  id: string;
  body: string;
};

type RewardRedemptionPayload = {
  userName: string;
  input: string;
  title: string;
  id: string;
}

type FollowPayload = {
  userName: string;
  id: string;
}

type SubPayload = {
  userName: string;
  id: string;
  tier: string;
  isGift: boolean;
}

type SubGiftPayload = {
  id: string;
  userName: string;
  isAnonymous: boolean,
  amount: number,
  cumulativeAmount: number,
  tier: string;
}

type IdPayload = {
  id: string;
};

type ActionConfig = {
  announcements: {
    rewardRedemption: RewardRedemptionPayload,
    newFollow: FollowPayload,
    newSub: SubPayload,
    giftSub: SubGiftPayload,
  },
  chat: {
    newMessage: MessagePaylod,
    messageRemove: IdPayload,
    messageLike: IdPayload,
  },
  host: {
    messageSelect: IdPayload,
    messageLike: IdPayload,
    messageUnselect: {}
  },
  focus: {
    messageFocus: MessagePaylod,
    messageUnfocus: {}
  }
}

export type WsChannelType = keyof ActionConfig;
export type Actions<T extends WsChannelType> = keyof ActionConfig[T];
export type Payload<T extends WsChannelType, A extends Actions<T> = Actions<T>> = ActionConfig[T][A]
