import { createRoot } from 'react-dom/client';
import { DependencyProvider } from "../../domains/dependencies/dependency";
import { mainDependencies } from "../_locals/clientDependencies";
import { ConnectProvider } from "../../domains/connect/ConnectProvider";
import { FeatureFlagProvider } from '../../domains/featureFlags/FeatureFlagProvider'; 
import { Guest } from '../../domains/guest/Guest';

const container =  document.getElementById('put-your-react-here');

const App = () => {
  return (
    <DependencyProvider dependencies={mainDependencies}>
      <ConnectProvider>
        <FeatureFlagProvider flags={{ firstMessage: false }}>
          <Guest />
        </FeatureFlagProvider>
      </ConnectProvider>
    </DependencyProvider>
  );
}

const root = createRoot(container!);

root.render(<App />);
