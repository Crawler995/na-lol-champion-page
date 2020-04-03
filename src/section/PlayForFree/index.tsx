import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { createClipRect } from '../../components/ClipRect';
import { limitNumBetweenRange, cubicEaseOut } from '../../utils';

const Wrapper = styled.section`
  position: relative;
  height: 100vh;
  min-height: 400px;
  max-height: 1200px;
  overflow: hidden;

  background-color: rgb(7, 18, 26);
`;

const Video = styled.video.attrs({
  loop: true,
  autoPlay: true,
  playsInline: true
})`
  position: relative;
  width: 100%;
  height: 140%;
  object-fit: cover;
  object-position: center top;

  transition: all 0.5s;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  padding: 4px;

  cursor: pointer;

  transition: all 0.5s;

  &:hover > button {
    background-color: #2be3ff;
  }
`;

const Button = styled.button`
  position: relative;
  width: 195px;
  height: 56px;
  padding: 0px 40px;

  outline: none;
  border: none;
  font-size: 13px;
  font-family: Spiegel, 'Arial Narrow', Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 0.15em;
  background-color: rgb(11, 198, 227);

  transition: background-color 0.3s;
`;

const ClipRectWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

class ClipRect extends React.PureComponent {
  render() {
    return (
      <ClipRectWrapper>
        {createClipRect({
          clipSize: {
            leftTop: 20,
            rightTop: 0,
            rightBottom: 20,
            leftBottom: 0
          },
          borderWidth: 1,
          borderColor: '#bcbcbc',
          hoverAnimation: true,
          lineGrowAnimation: false
        })}
      </ClipRectWrapper>
    );
  }
}

export default function PlayForFree() {
  const [enterViewportPercent, setEnterViewportPercent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHandler = () => {
      const curValue =
        1 -
        limitNumBetweenRange(ref.current!.getBoundingClientRect().top / window.innerHeight, 0, 1);
      setEnterViewportPercent(curValue);
    };

    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  const buttonClickHandler = () => {
    console.log('PLAY FOR FREE');
  };

  const height = window.innerHeight;
  const buttonWrapperOffset = cubicEaseOut(0, height / 5, enterViewportPercent) - height / 5;
  const videoOffset = cubicEaseOut(0, height / 3, enterViewportPercent) - height / 3;
  const videoOpacity = cubicEaseOut(0.2, 1, enterViewportPercent);

  return (
    <Wrapper ref={ref}>
      <ButtonWrapper
        style={{
          transform: `translate3d(-50%, ${buttonWrapperOffset}px, 0)`
        }}
        onClick={buttonClickHandler}
      >
        <Button>PLAY FOR FREE</Button>
        <ClipRect />
      </ButtonWrapper>
      <Video
        style={{
          opacity: videoOpacity,
          transform: `translate3d(0, ${videoOffset}px, 0)`
        }}
        src="https://assets.contentstack.io/v3/assets/blt731acb42bb3d1659/blt14edcfbe47516de6/5e1fc0e7d0427a10aaca9881/footer-1080.mp4"
      />
    </Wrapper>
  );
}
