import './message.css';
import cn from 'classnames';
import { Message as MessageType, User } from "common/types";
import { Stack, Inline, Box, Text } from 'ds'

//@ts-ignore
import url from './heart.png';

type MessageProps = {
  user?: User;
  isLiked?: boolean;
  content: MessageType["content"];
};

export const Message = ({ content, user = {}, isLiked }: MessageProps) => {
  return (
    <div className={cn("message", { liked: isLiked })}>
      <Stack space="s">
        {user && (
          <Inline space="l" vAlign="center">
            <div className="userNameBlock" style={{ borderColor: user.color }}>
              <Inline space="m" vAlign="center">
                <div
                  className="circle"
                  style={{ background: user.color }}
                ></div>
                <div className="userName">
                  <Text weight="bold" color="white">
                    {user.name}
                  </Text>
                </div>
              </Inline>
            </div>
            <Inline space="s" vAlign="center">
              {user.badges?.map(({ url }) => (
                <div
                  className="badgeBlock"
                  key={url}
                  style={{ borderColor: user.color }}
                >
                  <img src={url} />
                </div>
              ))}
            </Inline>
          </Inline>
        )}
        <div className={cn("messageContentBlock", { liked: isLiked, })}>
          <Box space="m" fitContent highlighted={user.isSubscriber}>
            <Text size="m">
              {content.map((part, i) => {
                if (part.type === "emote") {
                  return (
                    <img
                      style={{ height: 30 }}
                      key={part.emoteUrl + i}
                      src={part.emoteUrl}
                    />
                  );
                }
                if (part.type === "text") {
                  return part.text;
                }
              })}
            </Text>
          </Box>
          <div className={cn("messageLikeHeart")}><img src={url} /></div>
        </div>
      </Stack>
    </div>
  );
};
