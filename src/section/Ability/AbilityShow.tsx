import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.ul`
  display: block;

  padding: 0px;
`;

interface ItemProps {
  index: number;
  show: boolean;
}

const Item = styled.li`
  display: block;
  width: 100%;
  float: left;
  margin-left: ${(props: ItemProps) => (props.index === 0 ? '0' : '-100%')};
  list-style: none;
  opacity: ${(props: ItemProps) => (props.show ? 1 : 0)};

  transition: opacity 1s;
`;

const Video = styled.video.attrs({
  playsInline: true,
  loop: true,
  muted: true
})`
  display: block;
  width: 100%;
`;

interface IInfo {
  previewImageSrc: string;
  videoSrc: string;
}

interface IProps {
  infos: IInfo[];
  curIndex: number;
}

export default function AbilityShow(props: IProps) {
  return (
    <Wrapper>
      {props.infos.map((info, index) => (
        <Item key={info.videoSrc} index={index} show={index === props.curIndex}>
          <Video src={info.videoSrc} />
        </Item>
      ))}
    </Wrapper>
  );
}
