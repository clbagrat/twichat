import { Actions, WsChannelType, Payload } from "common/types";
import { useConnect } from './ConnectProvider';


export  const useSendMessage = () => {
  const connect = useConnect();

  return <T extends WsChannelType, A extends Actions<T>>(channel:T, action: A, payload: Payload<typeof channel, typeof action>) => {

    connect.send(JSON.stringify({
      channel,
      action,
      payload
    }));
  }
}
