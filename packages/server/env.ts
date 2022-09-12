const ENV_WHITE_LIST = [
  "TWITCH_CLIENT_ID",
  "TWITCH_CLIENT_SECRET",
  "PORT",
  "TWITCH_CHANNEL",
  "SEVEN_TV_URL",
  "SEVEN_TV_GLOBAL_URL",
  "TWITCH_EVENT_SUB_SECRET",
  "TWITCH_AUTH_SCOPE"
] as const;

export const getEnvVar = (name: typeof ENV_WHITE_LIST[number]): string => {
  if (process.env[name] === undefined) {
    throw new Error(`the env variable: ${name} is not defined`);
  }

  return process.env[name];
}

export const getAllEnvVars = (): Record<string, string | undefined> => {
  return ENV_WHITE_LIST.reduce((acc, name) => {
    acc[name] = getEnvVar(name);
    return acc;
  }, {} as Record<string, string | undefined>)
}
