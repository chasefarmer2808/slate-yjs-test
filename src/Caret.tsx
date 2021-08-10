import CSS from 'csstype';
import React from 'react';

const cursorStyleBase: CSS.Properties = {
  backgroundColor: 'palevioletred',
  color: 'white',
  fontSize: '10',
  pointerEvents: 'none',
  position: 'absolute',
  top: '-2',
  transform: 'translateY(-100%)',
  userSelect: 'none',
  whiteSpace: 'nowrap'
};

const caretStyleBase: CSS.Properties = {
  backgroundColor: 'palevioletred',
  height: '1.2em',
  pointerEvents: 'none',
  position: 'absolute',
  userSelect: 'none',
  width: '2'
};

const Caret: React.FC<any> = ({ isForward, label, color }) => {
  const cursorStyles = {
    ...cursorStyleBase,
    backgroundColor: color ?? 'blue',
    left: isForward ? '100%' : '0%'
  };
  const caretStyles = {
    ...caretStyleBase,
    backgroundColor: color ?? 'blue',
    left: isForward ? '100%' : '0%'
  };

  caretStyles[isForward ? 'bottom' : 'top'] = 0;

  return (
    <>
      <span contentEditable={false} style={caretStyles}>
        <span style={{ position: 'relative' }}>
          <span contentEditable={false} style={cursorStyles}>
            {label}
          </span>
        </span>
      </span>
    </>
  );
};

export default Caret;
