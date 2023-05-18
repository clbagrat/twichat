import { useState } from 'react';
import { Chat } from '../chat/Chat'
import { useSubscribeToAction } from '../connect/useSubscribeToAction';

export const Guest = () => {
  const [visibility, setVisibility] = useState(true);
  useSubscribeToAction("host", "hostFocus", () => setVisibility(false));
  useSubscribeToAction("host", "hostUnfocus", () => setVisibility(true));

  return (
    <div style={{ opacity: visibility ? 1 : 0 }}>
      <Chat />
    </div>
  );
}
