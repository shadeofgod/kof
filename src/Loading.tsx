import * as React from 'react';
import { useState, useEffect } from 'react';
// @ts-ignore
import images from '../assets/Mai Shiranui/*.png';
import App from './App';

const Loading: React.FC = () => {
  const [ready, setReadyState] = useState(false);

  useEffect(() => {
    (async () => {
      const assetsPromise = Object.values<string>(images).map(src => {
        return new Promise((resolve, reject) => {
          const el = document.createElement('img');
          el.src = src;
          el.onload = resolve;
          el.onerror = reject;
        });
      });

      await Promise.all(assetsPromise);

      setReadyState(true);
    })();
  }, []);

  if (ready) {
    return <App />
  }

  return <div>Loading assets...</div>;
}

export default Loading;