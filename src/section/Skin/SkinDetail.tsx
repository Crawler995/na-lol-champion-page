import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.ul`
  position: relative;
  padding: 0;

  &::after {
    content: '';
    display: block;
    clear: both;
  }
`;

const Item = styled.li`
  position: relative;
  display: block;
  float: left;
  list-style: none;
  width: 100%;
  opacity: ${(props: { show: boolean }) => (props.show ? 1 : 0)};

  transition: opacity 0.5s;
`;

const SkinImage = styled.img`
  display: block;
  width: 100%;
`;

interface IProps {
  skinSrcs: string[];
  curIndex: number;
}

export default function SkinDetail(props: IProps) {
  return (
    <Wrapper>
      {props.skinSrcs.map((src, index) => (
        <Item
          key={index}
          show={index === props.curIndex}
          style={{
            marginLeft: `-${index === 0 ? 0 : 1}00%`
          }}
        >
          <SkinImage src={src} />
        </Item>
      ))}
    </Wrapper>
  );
}
