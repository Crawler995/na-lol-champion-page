import styled from 'styled-components';
import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import { createClipRect } from '../../components/ClipRect';
import TWEEN from '@tweenjs/tween.js';
import { lgBreakpoint } from '../breakpoint';

const transition = `all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)`;

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 0px;

  display: flex;
  flex-direction: column;

  width: 25vw;
  min-width: 400px;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);

  @media screen and (max-width: ${lgBreakpoint}px) {
    position: relative;
    width: 100%;

    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: none;
  }
`;

const Title = styled.h2`
  display: block;
  margin: 40px 40px 0px 40px;
  padding: 20px;

  border-bottom: 1px solid rgba(193, 193, 193, 0.2);

  font-size: 40px;
  font-style: italic;
  font-family: 'Beaufort for LOL', 'Arial Narrow', Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 0.05em;
  color: #fff;

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: none;
  }
`;

const ItemWrapper = styled.div`
  flex-grow: 1;
  width: calc(100% + 15px);
  overflow: hidden;

  @media screen and (max-width: ${lgBreakpoint}px) {
    width: 100%;
  }
`;

const ItemList = styled.ul`
  padding-left: 60px;
  transform: translateY(${(props: { curIndex: number }) => 30 - props.curIndex * 100}px);

  transition: ${transition};

  &::after {
    content: '';
    display: block;
    clear: left;
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: flex;
    padding-left: 0px;
    transform: translateX(calc(${(props: { curIndex: number }) => -props.curIndex * 112}px + 30vw));
  }
`;

const Item = styled.li`
  position: relative;
  display: flex;
  height: 100px;
  margin: 10px 0px;

  list-style: none;

  &:hover {
    & > img {
      transform: scale(1.1);
      opacity: 1;
    }
    & > label {
      opacity: 1;
    }
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
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

  @media screen and (max-width: ${lgBreakpoint}px) {
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

  @media screen and (max-width: ${lgBreakpoint}px) {
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
  font-family: 'Spiegel', 'Arial Narrow', Arial, sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;

  transition: ${transition};

  & > span {
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
    position: absolute;
    display: block;
    flex: none;
    z-index: 3;
    top: 0px;
    padding-top: 80px;
    width: 100%;

    font-size: 10px;
    letter-spacing: 0.15em;
    text-align: center;

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

  @media screen and (max-width: ${lgBreakpoint}px) {
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
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > lgBreakpoint);
  const itemListRef = useRef<HTMLUListElement>(null);
  const slideInterval = 5000;

  useEffect(() => {
    const resizeHandler = () => {
      const width = window.innerWidth;
      setIsLargeScreen(width > lgBreakpoint);
    };
    window.addEventListener('resize', resizeHandler);

    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  useEffect(() => {
    const flag = setInterval(() => {
      const li = itemListRef.current?.children.item(
        (curIndex + 1) % props.skinImages.length
      ) as HTMLLIElement;
      const input = li.firstElementChild as HTMLInputElement;
      input.click();
    }, slideInterval);

    return () => {
      clearInterval(flag);
    };
  }, [curIndex, props.skinImages.length]);

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
                    isLargeScreen
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
