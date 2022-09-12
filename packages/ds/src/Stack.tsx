import './_locals/stack.css';

type StackProps = {
  children: React.ReactNode;
  space: 's' | 'm' | 'l'
}

export const Stack = ({children, space}: StackProps) => {
  return <div className={`stack ${space}`}>{children}</div>;
}
