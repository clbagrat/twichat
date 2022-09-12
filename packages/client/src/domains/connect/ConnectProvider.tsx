import { createContext, useMemo, useContext } from "react";
import { useEnv } from '../dependencies/useEnv';

const context = createContext(null);

export const ConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const wsUrl = useEnv("WS_URL");
  const connect = useMemo(() => new WebSocket(wsUrl!), []);

  return <context.Provider value={connect}>{children}</context.Provider>;
};

export const useConnect = () => {
  const connect = useContext(context);
  return connect;
}
