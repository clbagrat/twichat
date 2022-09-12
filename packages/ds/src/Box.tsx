import "./_locals/box.css";
import cn from 'classnames';

type BoxProps = {
  children: React.ReactNode;
  space: "s" | "m" | "l";
  fitContent?: boolean
  highlighted?: boolean
};

export const Box = ({
  space,
  children,
  fitContent,
  highlighted,
}: BoxProps) => {
  return (
    <div className={cn("box", space, {fitContent, highlighted})}>
      {children}
    </div>
  );
};
