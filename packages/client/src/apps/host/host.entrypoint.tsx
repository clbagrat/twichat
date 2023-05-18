import "./_locals/host.css";
import { createRoot } from 'react-dom/client';
import { Host } from '../../domains/host/Host';
import { DependencyProvider } from "../../domains/dependencies/dependency";
import { mainDependencies } from "../_locals/clientDependencies";
import { ConnectProvider } from "../../domains/connect/ConnectProvider";
import {FeatureFlagProvider} from "../../domains/featureFlags/FeatureFlagProvider";

const container =  document.getElementById('put-your-react-here');

const App = () => {
  return (
    <DependencyProvider dependencies={mainDependencies}>
      <ConnectProvider>
        <FeatureFlagProvider flags={{firstMessage: true, exclusiveHost: false}}>
          <Host />
        </FeatureFlagProvider>
      </ConnectProvider>
    </DependencyProvider>
  );
}

const root = createRoot(container!);

root.render(<App />);
