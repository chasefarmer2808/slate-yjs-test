import React, { useRef } from 'react';

interface RenderCountParams {
  top?: number;
  right?: number;
}

const RenderCount: React.FC<RenderCountParams> = ({ top = 0, right = 0 }) => {
  const countRef = useRef<number>(0);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span
        style={{
          position: 'absolute',
          top,
          right,
          color: 'white',
          fontStyle: 'normal',
          textAlign: 'center',
          height: '30px',
          width: '30px',
          lineHeight: '30px',
          borderRadius: '15px',
          border: '1px solid #ddd',
          backgroundColor: '#c51162',
          zIndex: 9999
        }}
      >
        {++countRef.current}
      </span>
    </div>
  );
};

export default RenderCount;
