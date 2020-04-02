import styled from 'styled-components';
import React, { useState } from 'react';
import SkinDetail from './SkinDetail';
import SkinSelect from './SkinSelect';

const breakpoint = 1000;

const Section = styled.section`
  padding: 60px;
  position: relative;

  @media screen and (max-width: ${breakpoint}px) {
    background-color: rgb(0, 9, 19);
  }
`;

const Brand = styled.div`
  position: absolute;
  width: 200px;
  height: 60px;
  line-height: 60px;
  font-size: 0.625rem;
  letter-spacing: 0.25em;
  font-family: 'Spiegel';
  font-weight: bold;
  left: 0;
  top: calc(50% + 100px);
  text-align: center;
  transform: rotate(-90deg);
  transform-origin: left top;

  @media screen and (max-width: ${breakpoint}px) {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 97.5rem;
  position: relative;
  margin: 0 auto;
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
      <Brand>AVAILABLE SKINS -</Brand>
      <Wrapper>
        <SkinDetail skinSrcs={skinImages.map(image => image.src)} curIndex={curIndex} />
        <SkinSelect skinImages={skinImages} onCurIndexChange={curIndexChangeHandler} />
      </Wrapper>
    </Section>
  );
}
