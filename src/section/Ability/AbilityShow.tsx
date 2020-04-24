import styled from 'styled-components';
import React, { useRef, useState, useEffect } from 'react';
import { createClipRect } from '../../components/ClipRect';
import TWEEN from '@tweenjs/tween.js';
import { lgBreakpoint, smBreakpoint } from '../breakpoint';

const Wrapper = styled.ul`
  position: relative;
  display: block;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  padding: 60px 0px 60px 0px;

  &::after {
    content: '';
    display: block;
    clear: left;
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
    top: 0;
    transform: none;
    padding: 0px 15%;
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    padding: 0px 30px;
  }
`;

interface ItemProps {
  index: number;
  show: boolean;
}

const Item = styled.li`
  position: relative;
  display: block;
  width: 100%;
  float: left;
  margin-left: ${(props: ItemProps) => (props.index === 0 ? '0' : '-100%')};

  list-style: none;
  opacity: ${(props: ItemProps) => (props.show ? 1 : 0)};

  transition: opacity 1s;
`;

const PreviewImage = styled.img`
  position: relative;
  display: block;
  z-index: 3;
  top: 0;
  width: 100%;
`;

const Video = styled.video.attrs({
  playsInline: true,
  loop: true,
  muted: true
})`
  position: absolute;
  display: block;
  z-index: 2;
  top: 0px;
  width: 100%;
`;

const ClipRectWrapper = styled.div`
  position: absolute;
  z-index: 4;
  top: 52px;
  left: 8px;
  right: 8px;
  bottom: 52px;

  @media screen and (max-width: ${lgBreakpoint}px) {
    top: -8px;
    left: calc(15% + 8px);
    right: calc(15% + 8px);
    bottom: -8px;
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    top: -8px;
    left: 38px;
    right: 38px;
    bottom: -8px;
  }
`;

interface IInfo {
  previewImageSrc: string;
  videoSrc: string;
}

interface IProps {
  infos: IInfo[];
  curIndex: number;
}

class ClipRect extends React.PureComponent {
  render() {
    return (
      <ClipRectWrapper>
        {createClipRect({
          borderWidth: 1,
          hoverAnimation: false,
          lineGrowAnimationConfig: {
            duration: 2000,
            timingFunction: TWEEN.Easing.Quadratic.InOut,
            lineGrowHeadConfig: {
              width: 1
            }
          }
        })}
      </ClipRectWrapper>
    );
  }
}

function AbilityShowItem(props: { info: IInfo; videoPlay: boolean; onImageLoad: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageHidden, setImageHidden] = useState(false);
  let playPromise = useRef<Promise<void>>();

  useEffect(() => {
    if (props.videoPlay) {
      playPromise.current = videoRef.current!.play();
    } else {
      playPromise.current?.then(() => {
        videoRef.current!.pause();
      });
    }
  }, [props.videoPlay, playPromise]);

  useEffect(() => {
    const handler = () => {
      setImageHidden(true);
    };
    const current = videoRef.current!;
    current.addEventListener('canplaythrough', handler);

    return () => current.removeEventListener('canplaythrough', handler);
  }, [videoRef]);

  const { onImageLoad } = props;
  useEffect(() => {
    const handler = () => {
      onImageLoad();
    };
    const current = imageRef.current!;
    current.addEventListener('load', handler);

    return () => current.removeEventListener('load', handler);
  }, [imageRef, onImageLoad]);

  return (
    <>
      <PreviewImage
        ref={imageRef}
        src={props.info.previewImageSrc}
        style={{
          opacity: Number(!imageHidden)
        }}
      />
      <Video src={props.info.videoSrc} ref={videoRef} />
    </>
  );
}

export default function AbilityShow(props: IProps) {
  const [canShowClipRect, setCanShowClipRect] = useState(false);

  return (
    <Wrapper>
      {props.infos.map((info, index) => (
        <Item key={info.videoSrc} index={index} show={index === props.curIndex}>
          <AbilityShowItem
            info={info}
            videoPlay={index === props.curIndex}
            onImageLoad={() => setCanShowClipRect(true)}
          />
        </Item>
      ))}
      {canShowClipRect ? <ClipRect /> : <></>}
    </Wrapper>
  );
}
