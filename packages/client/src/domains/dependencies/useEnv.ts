import { ClientEnvVars } from 'common/types';
import { useDependency } from "./dependency";


export const useEnv = (name: keyof ClientEnvVars): string => {
  const envVars = useDependency<Record<string, string>>("envVarStorage");

  if (!envVars[name]) {
    throw new Error(`Env variable ${name} is not provided`)
  }

  return envVars[name];
}
