import styled from 'styled-components';
import React, { useState } from 'react';
import SkinDetail from './SkinDetail';
import SkinSelect from './SkinSelect';
import {lgBreakpoint, smBreakpoint} from '../breakpoint';

const Section = styled.section`
  position: relative;
  padding: 60px;

  @media screen and (max-width: ${lgBreakpoint}px) {
    background-color: rgb(0, 9, 19);
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    padding: 60px 0px;
  }
`;

const Title = styled.h2`
  display: none;
  padding-bottom: 20px;

  font-size: 20px;
  font-style: italic;
  font-family: 'Beaufort for LOL';
  font-weight: bold;
  letter-spacing: 0.05em;
  text-align: center;
  color: #fff;
  
  @media screen and (max-width: ${smBreakpoint}px) {
    display: block;
  }
`;

const Brand = styled.div`
  position: absolute;
  left: 0;
  top: calc(50% + 100px);
  width: 200px;
  height: 60px;
  line-height: 60px;

  font-size: 0.625rem;
  font-family: 'Spiegel';
  font-weight: bold;
  letter-spacing: 0.25em;
  text-align: center;

  transform: rotate(-90deg);
  transform-origin: left top;

  @media screen and (max-width: ${lgBreakpoint}px) {
    color: rgba(255, 255, 255, 0.6);
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 97.5rem;
  margin: 0 auto;
  overflow: hidden;
`;

const skinImages = [
  {
    name: 'VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_0.jpg'
  },
  {
    name: 'VINDICATOR VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_1.jpg'
  },
  {
    name: 'ARISTOCRAT VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_2.jpg'
  },
  {
    name: 'DRAGONSLAYER VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_3.jpg'
  },
  {
    name: 'HEARTSEEKER VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_4.jpg'
  },
  {
    name: 'SKT T1 VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_5.jpg'
  },
  {
    name: 'ARCLIGHT VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_6.jpg'
  },
  {
    name: 'SOULSTEALER VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_10.jpg'
  },
  {
    name: 'PROJECT: VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_11.jpg'
  },
  {
    name: 'FIRECRACKER VAYNE',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_12.jpg'
  },
  {
    name: 'FIRECRACKER VAYNE PRESTIGE EDITION',
    src: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_13.jpg'
  }
];

export default function Skin() {
  const [curIndex, setCurIndex] = useState(0);

  const curIndexChangeHandler = (curIndex: number) => {
    setCurIndex(curIndex);
  };

  return (
    <Section>
      <Title>AVAILABLE SKINS</Title>
      <Brand>AVAILABLE SKINS -</Brand>
      <Wrapper>
        <SkinDetail skinSrcs={skinImages.map(image => image.src)} curIndex={curIndex} />
        <SkinSelect skinImages={skinImages} onCurIndexChange={curIndexChangeHandler} />
      </Wrapper>
    </Section>
  );
}
