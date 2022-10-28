import { createContext, useContext } from "react";


const context = createContext(null);

type AvailableFeatureFlags = 'firstMessage';

type FeatureFlags = Record<AvailableFeatureFlags, boolean>;

export const FeatureFlagProvider = ({
  children,
  flags,
}: {
  children: React.ReactNode;
  flags: FeatureFlags;
}) => {
  return <context.Provider value={flags}>{children}</context.Provider>;
};


export const useFeatureFlag = (flagName: AvailableFeatureFlags) => {
  const flags = useContext(context);

  return flags[flagName];
}
