import './_locals/inline.css';
import cn from 'classnames';

type InlineProps = {
  children: React.ReactNode;
  space: 'zero' | 's' | 'm' | 'l';
  vAlign?: 'start' | 'center' | 'end' 
}

export const Inline = ({children, space, vAlign = 'center'}: InlineProps) => {
  return <div className={cn(`inline ${space}`, {
    vStart: vAlign === 'start',
    vCenter: vAlign === 'center',
    vEnd: vAlign === 'end',
  })}>{children}</div>;
}
