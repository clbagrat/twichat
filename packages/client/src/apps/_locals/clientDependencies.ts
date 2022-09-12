import { ClientEnvVars } from "common/types";
import { DependencyRecord } from "../../domains/dependencies/dependency"

const envVarStorage: ClientEnvVars = {
  WS_URL: import.meta.env.VITE_WS_URL
}

export const mainDependencies: DependencyRecord = {
  window: window,
  document: document,
  envVarStorage
};
