import { useEffect } from 'react';
import { WsChannelType, Actions, Payload } from "common/types";
import { useConnect } from './ConnectProvider';

export const useSubscribeToAction = <T extends WsChannelType, A extends Actions<T>>(
  channel: T,
  action: A,
  cb: (payload: Payload<typeof channel, typeof action>) => void
) => {
  const connect = useConnect();

  useEffect(() => {
    const listener = function ({ data }: { data: string }) {
      const message = JSON.parse(data); 

      if (message.channel !== channel || message.action !== action) return;

      cb(message.payload);
    };

    connect.addEventListener("message", listener);

    return () => {
      connect.removeEventListener("message", listener);
    };
  }, [cb, connect]);
};
