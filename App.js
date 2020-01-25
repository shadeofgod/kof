import React, { useMemo, useState, useEffect, useCallback } from 'react';
import range from 'lodash/range';
import images from './assets/Mai Shiranui/*.png';
import './index.css';

const fps = 12;
const interval = 1000 / fps;

const CHAR_NAME = 'Mai Shiranui';

const headStand = range(170, 182);
const bodyStand = [0, 0, 1, 1, 0, 0, 2, 2, 3, 3, 2, 2];

const getCharImg = (n, imgCollections) => images[`${CHAR_NAME}_${imgCollections[n]}`];
const loop = range => index => index >= range.length - 1 ? 0 : index + 1;

let ts = 0;
let rafId = 0;

function App() {
  const [frame, setFrame] = useState(1);
  const [headIndex, setHead] = useState(0);
  const [bodyIndex, setBody] = useState(0);

  const headSrc = useMemo(() => {
    return getCharImg(headIndex, headStand);
  }, [headIndex]);

  const bodySrc = useMemo(() => {
    return getCharImg(bodyIndex, bodyStand);
  }, [bodyIndex]);

  const nextFrame = useCallback(() => {
    setFrame(frame => (frame + 1) % 60);
  });

  const refresh = useCallback((timestamp) => {
    if (timestamp - ts < interval) {
      rafId = window.requestAnimationFrame(refresh);
      return;
    };
    ts = timestamp;
    nextFrame();
    rafId = window.requestAnimationFrame(refresh);
  }, []);

  const start = useCallback(() => {
    rafId = window.requestAnimationFrame(refresh);
  }, [])

  const pause = useCallback(() => {
    window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    setHead(loop(headStand));
    setBody(loop(bodyStand));
  }, [frame])

  return (
    <div className="app">
      <div>
        <button onClick={start}>start</button>
        <button onClick={pause}>pause</button>
        <button onClick={nextFrame}>next frame</button>
        <button onClick={() => setBody(loop(bodyStand))}>change body</button>
        <div>current frame: {frame}</div>
        <div>current head index: {headIndex}</div>
        <div>current body index: {bodyIndex}</div>
      </div>

      <div className="character">
        <img src={headSrc} alt="char_head" className="char-head" />
        <img src={bodySrc} alt="char_body" className="char-body" />
      </div>
    </div>
  )
}

export default App;