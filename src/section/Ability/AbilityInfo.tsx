import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.ul`
  padding: 0px;
`;

const Type = styled.h6`
  font-size: 0.625rem;
  color: rgb(126, 126, 126);
`;

const Name = styled.h5`
  margin-top: 0.375rem;

  font-size: 1.125rem;
  color: #fff;
`;

const Description = styled.p`
  margin-top: 0.375rem;

  font-size: 0.875rem;
  color: #fff;
  line-height: 1.4;
  letter-spacing: 0.05em;
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

interface Info {
  type: string;
  name: string;
  description: string;
}

interface IProps {
  infos: Info[];
  curIndex: number;
}

export default function AbilityInfo(props: IProps) {
  return (
    <Wrapper>
      {props.infos.map((info, index) => (
        <Item key={info.type} index={index} show={index === props.curIndex}>
          <Type>{info.type}</Type>
          <Name>{info.name}</Name>
          <Description>{info.description}</Description>
        </Item>
      ))}
    </Wrapper>
  );
}
