import { createContext, useContext } from 'react';

const DEPS_WHITE_LIST = ["envVarStorage", "window", "document"] as const;

type Dependencies = typeof DEPS_WHITE_LIST[number];


export type DependencyRecord = Record<Dependencies, any>;
const context = createContext<DependencyRecord>({} as DependencyRecord);

type DependencyProviderProps = {
  dependencies: DependencyRecord,
  children: React.ReactNode;
}

export const DependencyProvider = ({ dependencies, children }: DependencyProviderProps) => {
  return <context.Provider value={dependencies}>{children}</context.Provider>
};

export const useDependency = <T,>(name: Dependencies): T => {
  const dependencies = useContext<DependencyRecord>(context);

  if (!dependencies[name]) {
    throw new Error(`dependency ${name} is not provided`);
  }

  return dependencies[name] as T;
};
