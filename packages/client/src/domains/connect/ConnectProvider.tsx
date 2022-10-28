import { createContext, useMemo, useContext, useState } from "react";
import { useEnv } from '../dependencies/useEnv';

const context = createContext(null);

export const ConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const wsUrl = useEnv("WS_URL");
  const [connectionAttempt, setConnectionAttempt] = useState<number>(0);
  const connect = useMemo(() => new WebSocket(wsUrl!), [connectionAttempt]);
  

  connect.onerror = () => {
    connect.close();
    setConnectionAttempt((prev) => prev + 1);
  }

  console.log("reconnect?")
  //@ts-ignore
  window.connection ??= []
  //@ts-ignore
  window.connection.push(connect);

  return <context.Provider value={connect}>{children}</context.Provider>;
};

export const useConnect = () => {
  const connect = useContext(context);
  console.log('useconneeect')
  return connect;
}
