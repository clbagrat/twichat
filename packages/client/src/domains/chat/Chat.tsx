import { useState, useEffect } from "react";
import { Payload } from "common/types";
import { useSubscribeToAction } from "../connect/useSubscribeToAction";
import { Message } from './_locals/Message';
import { Stack, Text } from 'ds';
import { useDependency } from "../dependencies/dependency";
import { useDataFromAction } from './_locals/useDataFromAction';

type ChatProps = {
  limit?: number;
  onMessageClick?: (message: Payload<"chat", "newMessage">) => void
}

type ChatLine = {
  type: "message" | "reward" | "follow" | "sub" | "subGift",
  id: string
}

export const Chat = ({onMessageClick, limit = 100}: ChatProps) => {
  const [lines, setLines] = useState<ChatLine[]>([])
  
  const addNewLine = (line: ChatLine) => {
    setLines([...lines, line].slice(-limit));
  };

  const [messages, setMessages] = useDataFromAction(
    "chat",
    "newMessage",
    (p) => p.message.id,
    (id) => {
      addNewLine({
        id,
        type: "message",
      });
    }
  );

  const [rewards, setRewards] = useDataFromAction(
    "announcements",
    "rewardRedemption",
    (p) => p.id,
    (id) => {
      addNewLine({
        id,
        type: "reward"
      });
    }
  )

  const [follows] = useDataFromAction(
    "announcements",
    "newFollow",
    p => p.id,
    id => {
      addNewLine({
        id,
        type: "follow"
      })
    }
  )

  const [subs] = useDataFromAction(
    "announcements",
    "newSub",
    p => p.id,
    id => {
      addNewLine({
        id,
        type: "sub"
      })
    }
  )

  const [giftSubs] = useDataFromAction(
    "announcements",
    "giftSub",
    p => p.id,
    id => {
      addNewLine({
        id,
        type: "subGift"
      })
    }
  );


  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const document = useDependency<Document>("document");
  
  useSubscribeToAction("chat", "messageLike", (payload) => {
      if (messages[payload.id] === undefined) {
        return;
      }

      setMessages({
        ...messages,
        [payload.id]: {
          ...messages[payload.id],
          message: {
            ...messages[payload.id].message,
            isLiked: true
          }
        }
      })
  });

  useSubscribeToAction("announcements", "rewardRedemption", (payload) => {
    setRewards({
      ...rewards,
      [payload.id]: payload
    });

    let li = [...lines, {
      type: "reward",
      id: payload.id
    } as ChatLine];
    setLines(li.slice(-limit));
  });
  
    const scrollBott = () => document.body.scrollTop = document.body.scrollHeight;

  useEffect(() => {
    if (isPaused) {
      return;
    }
    scrollBott();

  }, [lines.length, isPaused]);

  useEffect(() => {
    const onScroll = () => {
      setIsPaused(
        Math.floor(window.scrollY + window.innerHeight) !==
          Math.floor(document.body.scrollHeight)
      );
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [setIsPaused]);

  useSubscribeToAction("chat", "messageRemove", (payload) => {
      if (messages[payload.id] === undefined) {
        return;
      }
      
      setMessages({
        ...messages,
        [payload.id]: {
          ...messages[payload.id],
          message: {
            ...messages[payload.id].message,
            content: [{ type: "text", text: "deleted by mod" }],
          },
        },
      });
  });

  useSubscribeToAction("focus", "messageFocus", () => {
    setIsFocused(true);
  });

  useSubscribeToAction("focus", "messageUnfocus", () => {
    setIsFocused(false);
  });

  return (
    <div style={{ opacity: isFocused ? 0.5 : 1, padding: "5px" }}>
      <Stack space="l">
        {lines.map(({ type, id }) => {
          if (type === "message") {
            return (
              <div key={id} onClick={() => {onMessageClick(messages[id])}}>
                <Message
                  content={messages[id].message.content}
                  user={messages[id].user}
                  isLiked={messages[id].message.isLiked}
                />
              </div>
            );
          }

          if (type === "reward") {
            return (
              <Text key={id}>
                {rewards[id].userName}:{rewards[id].title} {rewards[id].input}
              </Text>
            );
          }

          if (type === "follow") {
            return <Text key={id}>{follows[id].userName} is following</Text>;
          }

          if (type === "sub") {
            return <Text key={id}>{subs[id].userName} just subscribed</Text>
          }

          if (type === "subGift") {
            return <Text key={id}>{giftSubs[id].userName} has gifted {giftSubs[id].amount} subs!</Text>
          }
        })}
      </Stack>
    </div>
  );
};
