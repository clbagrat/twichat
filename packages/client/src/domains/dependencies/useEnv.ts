import { ClientEnvVars } from 'common/types';
import { useDependency } from "./dependency";


export const useEnv = (name: keyof ClientEnvVars): string => {
  const envVars = useDependency<Record<string, string>>("envVarStorage");

  return envVars[name];
}
