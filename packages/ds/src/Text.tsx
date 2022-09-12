import './_locals/text.css';
import cn from 'classnames';

type TextProps = {
  children: React.ReactNode;
  color?: string;
  weight?: "bold" | "normal";
  inline?: boolean;
  size?: "s" | "m" | "l";
};
export const Text = ({
  children,
  color = "rgb(206, 209, 214)",
  weight = "normal",
  inline,
  size = "s"
}: TextProps) => {
  return (
    <p className={cn("text", size, { bold: weight === "bold", inline })} style={{ color }}>
      {children}
    </p>
  );
};
