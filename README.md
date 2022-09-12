# How to start

1) pnpm install

2) create .env file in the root

```
TWICHAT_CHANNEL=__YOUR_CHANNEL_NAME__
TWITCH_CLIENT_ID=__CLIENT_ID_OF_YOUR_APPLICATION__ (https://dev.twitch.tv/console/apps)
TWITCH_CLIENT_SECRET=__CLIENT_SECRET_OF_YOUT_APPLICATION__ (https://dev.twitch.tv/console/apps)
TWITCH_EVENT_SUB_SECRET=ANY_TEXT_REALLY_ITS_WIP
TWITCH_AUTH_SCOPE=channel:read:redemptions,channel:read:subscriptions
SEVEN_TV_URL=https://api.7tv.app/v2/users/__YOUR_CHANNEL_NAME__/emotes
SEVEN_TV_GLOBAL_URL=https://api.7tv.app/v2/emotes/global
PORT=5050
```

3) pnpm dev 

4) open a link that is been output in the terminal

5) open a link provided by Vite (starting from IP address)
