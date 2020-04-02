import styled from 'styled-components';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { createClipRect } from '../../components/ClipRect';
import TWEEN from '@tweenjs/tween.js';

const transition = `all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)`;
const breakpoint = 1000;

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

  @media screen and (max-width: ${breakpoint}px) {
    position: relative;
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: none;
  }
`;

const Title = styled.h2`
  display: block;
  font-size: 40px;
  font-style: italic;
  font-family: 'Beaufort for LOL';
  font-weight: bold;
  letter-spacing: 0.05em;
  color: #fff;
  margin: 40px 40px 0px 40px;
  padding: 20px;
  border-bottom: 1px solid rgba(193, 193, 193, 0.2);

  @media screen and (max-width: ${breakpoint}px) {
    display: none;
  }
`;

const ItemWrapper = styled.div`
  flex-grow: 1;
  width: calc(100% + 15px);
  overflow-y: hidden;

  @media screen and (max-width: ${breakpoint}px) {
    width: 100%;
    overflow-x: hidden;
  }
`;

const ItemList = styled.ul`
  padding-left: 60px;
  transform: translate3d(0, ${(props: { curIndex: number }) => 30 - props.curIndex * 100}px, 0);

  transition: ${transition};

  &::after {
    content: '';
    display: block;
    clear: left;
  }

  @media screen and (max-width: ${breakpoint}px) {
    display: flex;
    transform: translate3d(${(props: { curIndex: number }) => -props.curIndex * 100}px, 0, 0);
  }
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

  @media screen and (max-width: ${breakpoint}px) {
    display: block;
    height: auto;
    margin: 10px 20px 80px 20px;
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

  @media screen and (max-width: ${breakpoint}px) {
    margin: 6px;
  }
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

  @media screen and (max-width: ${breakpoint}px) {
    &:checked ~ img {
      transform: none;
      opacity: 1;
    }

    &:checked ~ label {
      padding-left: 0px;
      opacity: 1;
    }
  }
`;

const SkinName = styled.label`
  flex: 0.9;
  font-size: 14px;
  font-family: 'Spiegel';
  font-weight: 600;
  letter-spacing: 0.05em;
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

  @media screen and (max-width: ${breakpoint}px) {
    position: absolute;
    display: block;
    top: 0px;
    padding-top: 80px;
    z-index: 3;

    font-size: 10px;
    flex: none;
    text-align: center;
    width: 100%;

    & > span {
      top: 0;
      transform: none;
    }
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

  @media screen and (max-width: ${breakpoint}px) {
    height: 100%;
    padding: 0px;
    z-index: 1;
  }
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
  const [isPC, setIsPC] = useState(window.innerWidth > breakpoint);
  const itemListRef = useRef<HTMLUListElement>(null);

  window.onresize = () => {
    const width = window.innerWidth;
    setIsPC(width > breakpoint);
  };

  useEffect(() => {
    const flag = setInterval(() => {
      const li = itemListRef.current?.children.item(
        (curIndex + 1) % props.skinImages.length
      ) as HTMLLIElement;
      const input = li.firstElementChild as HTMLInputElement;
      input.click();
    }, 5000);

    return () => {
      clearInterval(flag);
    };
  });

  const curIndexChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const curIndex = props.skinImages.map(image => image.name).indexOf(e.target.value);
    setCurIndex(curIndex);
    props.onCurIndexChange(curIndex);
  };

  return (
    <Wrapper>
      <Title>AVAILABLE SKINS</Title>
      <ItemWrapper>
        <ItemList ref={itemListRef} curIndex={curIndex}>
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
                {index === curIndex ? (
                  createClipRect(
                    isPC
                      ? {
                          borderWidth: 1.6,
                          hoverAnimation: false
                        }
                      : {
                          draw: true,
                          borderColor: '#d0a85c',
                          hoverAnimation: false,
                          lineGrowAnimationConfig: {
                            duration: 1000,
                            timingFunction: TWEEN.Easing.Cubic.Out,

                            startDrawPointsNum: 3,
                            lineGrowHead: false
                          }
                        }
                  )
                ) : (
                  <></>
                )}
              </ClipRectWrapper>
            </Item>
          ))}
        </ItemList>
      </ItemWrapper>
    </Wrapper>
  );
}
