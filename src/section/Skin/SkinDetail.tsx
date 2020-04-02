import styled from 'styled-components';
import React from 'react';

// use dark background to make transition between images more natural
const Wrapper = styled.ul`
  position: relative;
  padding: 0;

  background-color: #000;

  &::after {
    content: '';
    display: block;
    clear: both;
  }
`;

interface IItem {
  show: boolean;
  index: number;
}

const Item = styled.li`
  position: relative;
  display: block;
  width: 100%;
  float: left;
  margin-left: ${(props: IItem) => (props.index === 0 ? '0' : '-100%')};

  list-style: none;
  opacity: ${(props: IItem) => (props.show ? 1 : 0)};

  transition: opacity 0.5s;
`;

// display: block to avoid extra padding-bottom of <img />
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
          index={index}
        >
          <SkinImage src={src} />
        </Item>
      ))}
    </Wrapper>
  );
}
