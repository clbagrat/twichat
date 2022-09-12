import "./_locals/pill.css";
import cn from "classnames";

type PillProps = {
  children: React.ReactNode;
  color?: string;
};

export const Pill = ({ children, color = "white" }: PillProps) => {
  return (
    <div className={cn("pill")} >
      {children}
    </div>
  );
};
