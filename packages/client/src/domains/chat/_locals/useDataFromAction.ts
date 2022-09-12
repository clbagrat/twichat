import { useState } from 'react';
import { useSubscribeToAction } from '../../connect/useSubscribeToAction';
import { WsChannelType, Actions, Payload } from "common/types";

export const useDataFromAction = <
  T extends WsChannelType,
  A extends Actions<T>
>(
  channel: T,
  action: A,
  getId: (payload: Payload<typeof channel, typeof action>) => string,
  onNew: (id: string) => void
): [Record<string, Payload<typeof channel, typeof action>>, (state: Record<string, Payload<typeof channel, typeof action>>) => void] => {
  const [data, setData] =
    useState<Record<string, Payload<typeof channel, typeof action>>>();

  useSubscribeToAction(channel, action, (payload) => {
    setData({
      ...data,
      [getId(payload)]: payload,
    });

    onNew(getId(payload));
  });

  return [data, setData];
};
