import { WebSocketServer, WebSocket } from "ws";
import { Actions, WsChannelType, Payload } from "../common/types";

export class Connector {
  private allConnectons: Set<WebSocket> = new Set();
  private connectionPerChannel: Partial<Record<WsChannelType, Set<WebSocket>>> =
    {};

  private onMessageSubscribers: Partial<
    Record<
      `${WsChannelType}-${Actions<WsChannelType>}`,
      Set<
        (
          socket: WebSocket,
          message: {
            channel: WsChannelType,
            action: Actions<WsChannelType>,
            payload: Payload<WsChannelType, Actions<WsChannelType>>
          }
        ) => void
      >
    >
  > = {};

  constructor(webSocketServer: WebSocketServer) {
    webSocketServer.on("connection", (ws) => {
      console.log('CONNECT')
      this.allConnectons.add(ws);
      this.subscribeWs(ws);
    });
  }

  private subscribeWs(ws: WebSocket) {
    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === "connect") {
        this.connectionPerChannel[message.channel] ??= new Set();
        this.connectionPerChannel[message.channel].add(ws);
        return;
      }

      const subscribers = this.onMessageSubscribers[`${message.channel}-${message.action}`] || [];

      for (let subscriber of subscribers) {
        subscriber(ws, message.payload);
      }
    });
  }

  public onMessage<T, A>(
    channel: T extends WsChannelType ? T : never,
    action: A extends Actions<T extends WsChannelType ? T : never> ? A: never,
    callback: (
      ws: WebSocket,
      payload: Payload<typeof channel, typeof action>
    ) => void
  ) {
    const key = `${channel}-${action.toString()}`;
    this.onMessageSubscribers[key] ??= new Set();
    this.onMessageSubscribers[key].add(callback);

    return () => {
      this.onMessageSubscribers[key].delete(callback);
    };
  }

  public broadcast<T extends WsChannelType, A extends Actions<T>>(
    channel: T,
    action: A,
    payload: Payload<typeof channel, typeof action>
  ) {
    for (let connection of this.allConnectons) {
      connection.send(JSON.stringify({
        channel,
        action,
        payload
      }));
    }
  }
}
