import { createRoot } from 'react-dom/client';
import { Chat } from '../../domains/chat/Chat';
import { DependencyProvider } from "../../domains/dependencies/dependency";
import { mainDependencies } from "../_locals/clientDependencies";
import { ConnectProvider } from "../../domains/connect/ConnectProvider";

const container =  document.getElementById('put-your-react-here');

const App = () => {
  return (
    <DependencyProvider dependencies={mainDependencies}>
      <ConnectProvider>
          <Chat />
      </ConnectProvider>
    </DependencyProvider>
  );
}

const root = createRoot(container!);

root.render(<App />);
