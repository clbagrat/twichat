import http from "http";
import express from "express";
import { WebSocketServer, AddressInfo } from "ws";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { getEnvVar } from "./env";
import { Connector } from "./Connector";
import { TwichatMain } from "./TwichatMain";
import { MessagePipeline } from "./messagePipeline/MessagePipeline";
import { SevenTv } from "./messagePipeline/integrations/7tv";
import { ApiClient } from "@twurple/api";
import { UserPipeline } from "./userPipeline/UserPipeline";
import { TwitchBadges } from "./userPipeline/integrations/TwitchBadges";
import { EventSubListener } from "@twurple/eventsub";
import { NgrokAdapter } from "@twurple/eventsub-ngrok";

console.log(getEnvVar("TWITCH_CHANNEL"));

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const authProvider = new ClientCredentialsAuthProvider(
  getEnvVar("TWITCH_CLIENT_ID"),
  getEnvVar("TWITCH_CLIENT_SECRET")
);

const apiClient = new ApiClient({ authProvider });

server.listen(process.env.PORT || 8999, async () => {
  const connector = new Connector(wss);
  const a = server.address() as AddressInfo;
  const user = await apiClient.users.getUserByName(getEnvVar("TWITCH_CHANNEL"));
  const is_affiliate = getEnvVar("TWITCH_IS_AFFILIATE") === 'true';

  let listener = undefined;

  if (is_affiliate) {
    await apiClient.eventSub.deleteAllSubscriptions();

    listener = new EventSubListener({
      apiClient,
      adapter: new NgrokAdapter(),
      secret: getEnvVar("TWITCH_EVENT_SUB_SECRET"),
    });

    await listener.listen();
  }

  console.log(`---------------------------------------------`);
  console.log('Please, open the link below to authorize');
  console.log(`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${getEnvVar(
    "TWITCH_CLIENT_ID"
  )}&redirect_uri=http://localhost&scope=${getEnvVar(
    "TWITCH_AUTH_SCOPE"
  )}&state=c3ab8aa609ea11e793ae92361f002671
`);
  console.log(`---------------------------------------------`);

  const chatClient = new ChatClient({
    channels: [getEnvVar("TWITCH_CHANNEL")],
  });


  new TwichatMain(
    user,
    connector,
    chatClient,
    listener,
    new UserPipeline([
      new TwitchBadges(apiClient, getEnvVar("TWITCH_CHANNEL")),
    ]),
    new MessagePipeline([
      new SevenTv(getEnvVar("SEVEN_TV_URL"), getEnvVar("SEVEN_TV_GLOBAL_URL")),
    ])
  );

  chatClient.connect().then(() => {
    console.log("chat client is ready");
  });

  console.log(`Server started on  ${a.address}  ${a.port})`);
});
