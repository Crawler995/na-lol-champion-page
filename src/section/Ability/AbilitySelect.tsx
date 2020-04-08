import styled from 'styled-components';
import React, { ChangeEvent, useState } from 'react';
import { createClipRect } from '../../components/ClipRect';
import TWEEN from '@tweenjs/tween.js';
import { lgBreakpoint, smBreakpoint } from '../breakpoint';

const VariableWrapper = styled.div`
  --img-width: 60px;
  --img-margin: 17px;
  --dis-between-img-cliprect: 6px;
  --moved-sphere-radius: 10px;

  @media screen and (max-width: ${lgBreakpoint}px) {
    --img-margin: 0px;
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    --img-width: 50px;
    --img-margin: 0px;
    --dis-between-img-cliprect: 3px;
  }
`;

const Wrapper = styled.ul`
  position: relative;
  display: flex;
  padding: 0px;
  padding-left: 5vw;

  text-align: center;
  border-bottom: 1px solid rgb(57, 64, 72);

  @media screen and (max-width: ${lgBreakpoint}px) {
    padding: 60px 15%;
    justify-content: space-between;

    border-bottom: none;
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    padding: 30px;
  }
`;

const Item = styled.li`
  position: relative;
  padding: 0px;

  list-style: none;
`;

const Icon = styled.img`
  display: block;

  width: var(--img-width);
  height: var(--img-width);
  margin: var(--img-margin) var(--img-margin) 0px var(--img-margin);

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
      transform: translate3d(0, -16px, 0) !important;
    }

    & ~ .vertical-line {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
    &:checked {
      & ~ img,
      & ~ .cliprect-wrapper {
        transform: translate3d(0, 0, 0) !important;
      }
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
      transform: translate3d(0, -6px, 0);
    }

    & ~ .bottom-sphere {
      background-color: #d0a85c;
    }
  }

  @media screen and (max-width: ${lgBreakpoint}px) {
    &:hover {
      & ~ img {
        transform: translate3d(0, 10px, 0);
      }
    }
  }
`;

const ClipRectWrapper = styled.div.attrs({
  className: 'cliprect-wrapper'
})`
  position: absolute;
  z-index: 2;
  top: calc(var(--img-margin) - var(--dis-between-img-cliprect));
  left: calc(var(--img-margin) - var(--dis-between-img-cliprect));
  width: calc(var(--img-width) + var(--dis-between-img-cliprect) * 2);
  height: calc(var(--img-width) + var(--dis-between-img-cliprect) * 2);
`;

const VerticalLine = styled.div.attrs({
  className: 'vertical-line'
})`
  position: relative;
  top: 8px;
  height: 20px;
  width: 1px;
  margin-left: 50%;

  background: #d0a85c;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center bottom;

  transition: transform 0.6s 0.8s;

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: none;
  }
`;

const BottomSphere = styled.div.attrs({
  className: 'bottom-sphere'
})`
  position: relative;
  display: inline-block;
  top: 9px;
  width: 9px;
  height: 9px;
  border-radius: 9px;
  background-color: rgb(57, 64, 72);

  transition: all 0.4s;

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: none;
  }
`;

const MovedSphere = styled.div`
  position: relative;
  z-index: 5;
  top: calc(var(--moved-sphere-radius) * -1);
  left: calc(${(props: { curIndex: number }) => props.curIndex + 0.5} *
    (var(--img-width) + 2 * var(--img-margin)) - var(--moved-sphere-radius) + 5vw);
  width: calc(var(--moved-sphere-radius) * 2);
  height: calc(var(--moved-sphere-radius) * 2);
  border-radius: calc(var(--moved-sphere-radius) * 2);
  
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

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: none;
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
    <VariableWrapper>
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
            <BottomSphere />
          </Item>
        ))}
      </Wrapper>
      <MovedSphere curIndex={curIndex} />
    </VariableWrapper>
  );
}
