import { createContext, useMemo, useContext, useState, useEffect } from "react";
import { useEnv } from '../dependencies/useEnv';

const context = createContext(null);

export const ConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const wsUrl = useEnv("WS_URL");
  const [connectionAttempt, setConnectionAttempt] = useState<number>(0);
  const connect = useMemo(() => new WebSocket(wsUrl!), [connectionAttempt]);

  useEffect(() => {
    let timeout = 0;
    connect.onclose = connect.onerror = () => {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
        setConnectionAttempt((prev) => prev + 1);
      }, 1000);
    };

    return () => {
      if (timeout > 0) {
        clearTimeout(timeout);
      }
    }
  }, [connect]);

  return <context.Provider value={connect}>{children}</context.Provider>;
};

export const useConnect = () => {
  const connect = useContext(context);

  return connect;
}
