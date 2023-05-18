import { useEffect, useState } from 'react';
import { Chat } from '../chat/Chat'
import { useSendMessage } from "../connect/useSendMessage";
import { Payload } from "common/types";
import { useDependency } from '../dependencies/dependency';
import { useFeatureFlag } from '../featureFlags/FeatureFlagProvider';

export const Host = () => {
  const sendMessage = useSendMessage();
  const [selectedMessage, setSelectedMessage] = useState<Payload<"chat", "newMessage">>(null);
  const [singleClickTimer, setSingleClickTimer] = useState<number>();
  const doc = useDependency<Document>("document");
  const isExclusiveHost = useFeatureFlag("exclusiveHost");

  const unselect = () => {
    setSelectedMessage(null)
    sendMessage("host", "messageUnselect", {});
  }

  useEffect(() => {
    if (!isExclusiveHost) return;
    
    const listener = () => {
      if (doc.hidden) {
        sendMessage("host", "hostUnfocus", {});
      } else {
        sendMessage("host", "hostFocus", {});
      }
    };

    doc.addEventListener('visibilitychange', listener);

    return () => {
      doc.removeEventListener('visibilitychange', listener);
    }
  }, []);

  return (
    <Chat
      onMessageDoubleClick={(messagePayload) => {
        sendMessage("host", "messageLike", {
          id: messagePayload.message.id
        })
        clearTimeout(singleClickTimer);
        unselect();
      }}
      onMessageClick={(messagePayload) => {
        clearTimeout(singleClickTimer);
        setSingleClickTimer(setTimeout(() => {
          if (selectedMessage?.message.id === messagePayload.message.id) {
            unselect();
          } else {
            setSelectedMessage(messagePayload);
            sendMessage("host", "messageSelect", {
              id: messagePayload.message.id
            })
          }
        }, 200))
      }}
    />
  );
}
