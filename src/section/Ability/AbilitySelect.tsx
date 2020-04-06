import styled from 'styled-components';
import React, { ChangeEvent, useState } from 'react';
import { createClipRect } from '../../components/ClipRect';
import TWEEN from '@tweenjs/tween.js';

const Wrapper = styled.ul`
  position: relative;
  display: flex;

  padding: 0px;
`;

const Item = styled.li`
  position: relative;
  padding: 0px;

  list-style: none;
`;

const Icon = styled.img`
  display: block;

  width: 60px;
  height: 60px;
  margin: 20px 20px 0px 20px;

  transition: all 0.4s;
`;

const HiddenInput = styled.input.attrs({
  type: 'radio',
  hidden: true
})`
  outline: none;
  appearance: none;

  &:checked {
    & ~ img,
    & ~ .cliprect-wrapper {
      transform: translate3d(0, -20px, 0) !important;
    }

    & ~ .vertical-line {
      opacity: 1;
      transform: scaleY(1);
    }
  }
`;

const HiddenLabel = styled.label`
  position: absolute;
  display: block;
  z-index: 3;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  cursor: pointer;

  &:hover {
    & ~ img {
      transform: translate3d(0, -8px, 0);
    }

    & ~ .bottom-line {
      &::before {
        background-color: #d0a85c;
      }
    }
  }
`;

const ClipRectWrapper = styled.div.attrs({
  className: 'cliprect-wrapper'
})`
  position: absolute;
  z-index: 2;
  top: 14px;
  left: 14px;
  width: 72px;
  height: 72px;
`;

const VerticalLine = styled.div.attrs({
  className: 'vertical-line'
})`
  height: 20px;
  width: 1px;
  margin-left: 50%;

  background: #d0a85c;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center bottom;

  transition: transform 0.6s 0.8s;
`;

const BottomLine = styled.div.attrs({
  className: 'bottom-line'
})`
  position: relative;
  top: 6px;
  width: 100%;
  height: 9px;

  &::before {
    content: '';
    position: absolute;
    z-index: 4;
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-left: calc(50% - 4.5px);
    border-radius: 9px;
    background-color: rgb(57, 64, 72);

    transition: all 0.4s;
  }

  &::after {
    content: '';
    position: absolute;
    display: inline-block;
    left: 0px;
    top: 4px;
    width: 100%;
    height: 1px;
    background-color: rgb(57, 64, 72);
  }
`;

const MovedSphere = styled.div`
  position: relative;
  z-index: 5;
  top: -8px;
  left: ${(props: { curIndex: number }) => props.curIndex * 100 + 40}px;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 2px solid #d0a85c;

  transition: 1s all;

  &::before {
    content: '';
    position: absolute;
    display: block;
    top: 4px;
    left: 4px;

    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: #d0a85c;
  }
`;

interface IProps {
  iconSrcs: string[];
  onCurIndexChange: (curIndex: number) => void;
}

export default function AbilitySelect(props: IProps) {
  const [curIndex, setCurIndex] = useState(0);

  const curIndexChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const curIndex = props.iconSrcs.indexOf(e.target.value);
    setCurIndex(curIndex);
    props.onCurIndexChange(curIndex);
  };

  return (
    <>
      <Wrapper>
        {props.iconSrcs.map((src, index) => (
          <Item key={src}>
            <HiddenInput
              defaultChecked={index === 0}
              name="ability"
              value={src}
              id={src}
              onChange={curIndexChangeHandler}
            />
            <HiddenLabel htmlFor={src} />
            <Icon src={src} />
            <ClipRectWrapper>
              {curIndex === index ? (
                createClipRect({
                  draw: true,
                  borderColor: '#d0a85c',
                  hoverAnimation: false,
                  lineGrowAnimationConfig: {
                    duration: 1000,
                    timingFunction: TWEEN.Easing.Cubic.Out,

                    startDrawPointsNum: 3,
                    lineGrowHead: false
                  }
                })
              ) : (
                <></>
              )}
            </ClipRectWrapper>
            <VerticalLine />
            <BottomLine />
          </Item>
        ))}
      </Wrapper>
      <MovedSphere curIndex={curIndex} />
    </>
  );
}
