import { useEffect } from 'react';
import { WsChannelType, Actions, Payload } from "common/types";
import { useConnect } from './ConnectProvider';

export const useSubscribeToChannel = <T extends WsChannelType>(
  channelType: T,
  cb: (action: Actions<T>, payload: Payload<T, typeof action>) => void
) => {
  const connect = useConnect();

  useEffect(() => {
    const listener = function ({ data }: { data: string }) {
      console.log(data)
      const message = JSON.parse(data);

      if (message.channelType !== channelType) return;

      cb(message.action, message.payload);
    };

    connect.addEventListener("message", listener);

    return () => {
      connect.removeEventListener("message", listener);
    };
  }, [cb]);
};
