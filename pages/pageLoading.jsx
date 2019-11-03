

import { Spin } from 'antd';

export default () => {
  return (
    <div className="root">
      <Spin />
      <style jsx>{`
        .root{
          width: 100%;
          height: 100%;
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(255,255,255,0.3);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}