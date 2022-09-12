import './_locals/modal.css';
import { createPortal } from "react-dom";
import { Stack } from "./Stack";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ onClose, children }: ModalProps) => {
  return createPortal(
    <div className="modal">
      <Stack space="l">
        <div>{children}</div>
        <button onClick={onClose}>X</button>
      </Stack>
    </div>,
    document.querySelector("#placeForModal")!
  );
};
