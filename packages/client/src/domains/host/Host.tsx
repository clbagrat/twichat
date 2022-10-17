import { useState } from 'react';
import { Chat } from '../chat/Chat'
import { useSendMessage } from "../connect/useSendMessage";
import { Payload } from "common/types";
import { Message as MsgComp } from "../chat/_locals/Message";
import { Stack, Modal } from "ds";


export const Host = () => {
  const sendMessage = useSendMessage();
  const [selectedMessage, setSelectedMessage] = useState<Payload<"chat", "newMessage">>(null);
  const close = () => {
    setSelectedMessage(null);
    sendMessage("host", "messageUnselect", {});
  }

  return (
    <>
      {selectedMessage && (
        <Modal onClose={close}>
          <Stack space="m">
            <MsgComp content={selectedMessage.message.content} user={selectedMessage.user} />
            <button
              onClick={() => {
                sendMessage("host", "messageLike", {
                  id: selectedMessage.message.id,
                });
              }}
            >
              like
            </button>
          </Stack>
        </Modal>
      )}
      <Chat
        onMessageClick={(messagePayload) => {
          setSelectedMessage(messagePayload);
          sendMessage("host", "messageSelect", {
            id: messagePayload.message.id
          })
        }}
      />
    </>
  );
}
