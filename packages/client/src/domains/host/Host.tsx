import { useState } from 'react';
import { Chat } from '../chat/Chat'
import { useSendMessage } from "../connect/useSendMessage";
import { Message } from "common/types";
import { Message as MsgComp } from "../chat/_locals/Message";
import { Stack, Modal } from "ds";


export const Host = () => {
  const sendMessage = useSendMessage();
  const [selectedMessage, setSelectedMessage] = useState<Message>(null);
  const close = () => {
    setSelectedMessage(null);
    sendMessage("host", "messageUnselect", {});
  }

  return (
    <>
      {selectedMessage && (
        <Modal onClose={close}>
          <Stack space="m">
            <MsgComp content={selectedMessage.content} />
            <button
              onClick={() => {
                sendMessage("host", "messageLike", {
                  id: selectedMessage.id,
                });
              }}
            >
              like
            </button>
          </Stack>
        </Modal>
      )}
      <Chat
        onMessageClick={({ message }) => {
          setSelectedMessage(message);
          sendMessage("host", "messageSelect", {
            id: message.id
          })
        }}
      />
    </>
  );
}
