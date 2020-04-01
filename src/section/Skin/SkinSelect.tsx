import styled from 'styled-components';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { createClipRect } from '../../components/ClipRect';

const transition = `all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)`;

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 2;
  top: 0px;
  width: 25vw;
  min-width: 400px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const Title = styled.h2`
  display: block;
  font-size: 40px;
  font-style: italic;
  color: #fff;
  margin: 40px 40px 0px 40px;
  padding: 20px;
  border-bottom: 1px solid rgba(193, 193, 193, 0.2);
`;

const ItemWrapper = styled.div`
  flex-grow: 1;
  width: calc(100% + 15px);
  overflow-y: hidden;
`;

const ItemList = styled.ul`
  padding-left: 60px;
  transform: translate3d(0, 30px, 0);

  transition: ${transition};
`;

const Item = styled.li`
  list-style: none;
  height: 100px;
  margin: 10px 0px;
  display: flex;
  position: relative;

  &:hover {
    & > img {
      transform: scale(1.1);
      opacity: 1;
    }
    & > label {
      opacity: 1;
    }
  }
`;

const PreviewImage = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  margin: 20px;
  object-fit: cover;
  opacity: 0.7;
  transition: ${transition};
`;

const HiddenInput = styled.input.attrs({
  type: 'radio',
  hidden: true
})`
  outline: none;
  appearance: none;

  &:checked ~ img {
    transform: scale(1.66);
    opacity: 1;
  }

  &:checked ~ label {
    padding-left: 20px;
    opacity: 1;
  }
`;

const SkinName = styled.label`
  flex: 0.9;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  opacity: 0.7;

  transition: ${transition};

  & > span {
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const ClipRectWrapper = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  padding: 8px 0px 8px 20px;
`;

interface IProps {
  skinImages: {
    name: string;
    src: string;
  }[];
  onCurIndexChange: (curIndex: number) => void;
}

export default function SkinSelect(props: IProps) {
  const [curIndex, setCurIndex] = useState(0);
  const itemListRef = useRef<HTMLUListElement>(null);

  const curIndexChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const curIndex = props.skinImages.map(image => image.name).indexOf(e.target.value);
    setCurIndex(curIndex);
    props.onCurIndexChange(curIndex);
    itemListRef.current!.style.transform = `translate3d(0, ${30 - curIndex * 100}px, 0)`;
  };

  return (
    <Wrapper>
      <Title>AVAILABLE SKINS</Title>
      <ItemWrapper>
        <ItemList ref={itemListRef}>
          {props.skinImages.map((image, index) => (
            <Item key={image.name}>
              <HiddenInput
                defaultChecked={index === 0}
                name="skin-names"
                id={image.name}
                value={image.name}
                onChange={curIndexChangeHandler}
              />
              <PreviewImage src={image.src} />
              <SkinName htmlFor={image.name}>{<span>{image.name}</span>}</SkinName>

              <ClipRectWrapper>
                {index === curIndex ? createClipRect({
                  draw: true, 
                  borderWidth: 1.6,
                  hoverAnimation: false
                }) : <></>}
              </ClipRectWrapper>
            </Item>
          ))}
        </ItemList>
      </ItemWrapper>
    </Wrapper>
  );
}
