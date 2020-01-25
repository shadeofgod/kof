import * as React from 'react';
import { useMemo, useState, useEffect, useCallback } from 'react';
import range from 'lodash/range';
// @ts-ignore
import images from '../assets/Mai Shiranui/*.png';
import './index.css';

// this is visual fps, we only re-render on 12 fps not on real browser 60 fps since that would be too fast.
const fps = 12;
const interval = 1000 / fps;

const CHAR_NAME = 'Mai Shiranui';

const headStand = range(170, 182);
const bodyStand = [0, 0, 1, 1, 0, 0, 2, 2, 3, 3, 2, 2];

const getCharImg = (n: number, collections: number[]) => images[`${CHAR_NAME}_${collections[n]}`];
const loop = (range: number[]) => (index: number) => index >= range.length - 1 ? 0 : index + 1;

let ts = 0;
let rafId = 0;

const useLoopImage = (collections: number[]) => {
  const [index, setter] = useState(0);
  const src = useMemo(() => {
    return getCharImg(index, collections);
  }, [index]);
  const nextSrc = useCallback(() => {
    setter(loop(collections));
  }, [])

  return [src, nextSrc];
}

const App: React.FC = () => {
  const [frame, setFrame] = useState(1);
  const [headSrc, nextHeadSrc] = useLoopImage(headStand);
  const [bodySrc, nextBodySrc] = useLoopImage(bodyStand);

  const nextFrame = useCallback(() => {
    setFrame(frame => (frame + 1) % 60);
  }, []);

  const tick = useCallback((timestamp) => {
    if (timestamp - ts < interval) {
      rafId = requestAnimationFrame(tick);
      return;
    };
    ts = timestamp;
    nextFrame();
    rafId = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    rafId = requestAnimationFrame(tick);
  }, [])

  const pause = useCallback(() => {
    cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    nextHeadSrc();
    nextBodySrc();
  }, [frame])

  return (
    <div className="app">
      <div>
        <button onClick={start}>start</button>
        <button onClick={pause}>pause</button>
        <button onClick={nextFrame}>next frame</button>

        <div>current frame: {frame}</div>
        <div>current head src: {headSrc}</div>
        <div>current body src: {bodySrc}</div>
      </div>

      <div className="character">
        <img src={headSrc} alt="char_head" className="char-head" />
        <img src={bodySrc} alt="char_body" className="char-body" />
      </div>
    </div>
  )
}

export default App;