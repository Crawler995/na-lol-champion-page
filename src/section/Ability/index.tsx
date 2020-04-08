import styled from 'styled-components';
import React, { useState } from 'react';
import AbilitySelect from './AbilitySelect';
import AbilityInfo from './AbilityInfo';
import AbilityShow from './AbilityShow';
import { lgBreakpoint, smBreakpoint } from '../breakpoint';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  padding: 60px 100px 200px 0px;

  background-color: rgb(0, 9, 19);

  @media screen and (max-width: ${lgBreakpoint}px) {
    flex-direction: column-reverse;
    padding: 60px 0px;
  }
`;

const Title = styled.h2`
  padding: 0px 0px 40px 6vw;

  font-family: 'Beaufort for LOL', serif;
  font-weight: bold;
  font-size: 3.75rem;
  font-style: italic;
  letter-spacing: 0.05em;

  color: #fff;

  @media screen and (max-width: ${lgBreakpoint}px) {
    display: none;
  }
`;

const Brand = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: fit-content;
  padding: 20px 0px 0px 100px;

  font-size: 0.625rem;
  letter-spacing: 0.25em;
  font-family: Spiegel, 'Arial Narrow', Arial, sans-serif;
  color: #fff;

  transform: rotate(-90deg);
  transform-origin: left top;

  @media screen and (max-width: ${smBreakpoint}px) {
    display: none;
  }
`;

const Left = styled.div`
  flex: 2 1 120%;
  position: relative;
  z-index: 2;
`;

const Right = styled.div`
  flex: 1 1 100%;
  z-index: 2;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  text-align: center;

  & > svg {
    position: relative;
    display: inline-block;
    height: 80%;
    top: 10%;
    fill: rgb(7, 18, 26);
  }

  @media screen and (max-width: ${smBreakpoint}px) {
    & > svg {
      top: 50%;
      height: 50%;
    }
  }
`;

interface IAbilityInfo {
  type: string;
  name: string;
  description: string;
  iconSrc: string;
  previewImageSrc: string;
  videoSrc: string;
}

const abilitiesInfo: IAbilityInfo[] = [
  {
    type: 'PASSIVE',
    name: 'NIGHT HUNTER',
    description:
      'Vayne ruthlessly hunts evil-doers, gaining 30 movement speed when moving toward nearby enemy champions.',
    iconSrc: 'https://ddragon.leagueoflegends.com/cdn/10.7.1/img/passive/Vayne_NightHunter.png',
    previewImageSrc:
      'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_P1.jpg',
    videoSrc: 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_P1.mp4'
  },
  {
    type: 'Q',
    name: 'TUMBLE',
    description:
      'Vayne tumbles, maneuvering to carefully place her next shot. Her next attack deals bonus damage.',
    iconSrc: 'https://ddragon.leagueoflegends.com/cdn/10.7.1/img/spell/VayneTumble.png',
    previewImageSrc:
      'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_Q1.jpg',
    videoSrc: 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_Q1.mp4'
  },
  {
    type: 'W',
    name: 'SILVER BOLTS',
    description:
      "Vayne tips her bolts with a rare metal, toxic to evil things. The third consecutive attack or ability against the same target deals a percentage of the target's max health as bonus true damage.",
    iconSrc: 'https://ddragon.leagueoflegends.com/cdn/10.7.1/img/spell/VayneSilveredBolts.png',
    previewImageSrc:
      'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_W1.jpg',
    videoSrc: 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_W1.mp4'
  },
  {
    type: 'E',
    name: 'CONDEMN',
    description:
      'Vayne draws a heavy crossbow from her back, and fires a huge bolt at her target, knocking them back and dealing damage. If they collide with terrain, they are impaled, dealing bonus damage and stunning them.',
    iconSrc: 'https://ddragon.leagueoflegends.com/cdn/10.7.1/img/spell/VayneCondemn.png',
    previewImageSrc:
      'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_E1.jpg',
    videoSrc: 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_E1.mp4'
  },
  {
    type: 'R',
    name: 'FINAL HOUR',
    description:
      'Readying herself for an epic confrontation, Vayne gains increased Attack Damage, Invisibility during Tumble, reduced Tumble cooldown, and more bonus Movement Speed from Night Hunter.',
    iconSrc: 'https://ddragon.leagueoflegends.com/cdn/10.7.1/img/spell/VayneInquisition.png',
    previewImageSrc:
      'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_R1.jpg',
    videoSrc: 'https://d28xe8vt774jo5.cloudfront.net/champion-abilities/0067/ability_0067_R1.mp4'
  }
];

export default function Ability() {
  const [curIndex, setCurIndex] = useState(0);

  return (
    <Wrapper>
      <Left>
        <Title>ABILITIES</Title>
        <Brand>ABILITIES -</Brand>
        <AbilitySelect
          iconSrcs={abilitiesInfo.map(info => info.iconSrc)}
          onCurIndexChange={curIndex => setCurIndex(curIndex)}
        />
        <AbilityInfo curIndex={curIndex} infos={abilitiesInfo} />
      </Left>

      <Right>
        <AbilityShow infos={abilitiesInfo} curIndex={curIndex} />
      </Right>

      <Background>
        <svg viewBox="0 0 100 100">
          <path d="M28.69 27.25h6.94l1.92-6.94-13.41-7.91zM71.31 27.25l4.55-14.85-13.41 7.91 1.92 6.94zM71.31 35.39c-1.43 0-12.21-3.83-12.21-3.83L50 42.34l-9.1-10.78s-10.54 3.83-12.21 3.83c-7.67 0-4.79-7.18-4.79-7.18S4.26 48.32 2.11 64.13c0 0 5.74-8.86 24.42-13.17a26.22 26.22 0 0013.89 12.93c-.72-3.11-1.44-6.71-2.15-10.06a22.36 22.36 0 01-3.84-4.31c.72 0 7.19-.72 8.15-.72.71 2.64 4.55 28.74 4.55 28.74l-7 10.3v10L50 93.82l9.82 4.07V87.6l-7-10.3s3.84-26.1 4.55-28.74c.72 0 7.19.72 8.15.72a16.52 16.52 0 01-3.84 4.31 98.08 98.08 0 00-2.15 10.06 25.33 25.33 0 0013.94-12.93c18.68 4.55 24.42 13.17 24.42 13.17C95.74 48.32 76.1 28 76.1 28s2.88 7.42-4.79 7.42"></path>
          <path d="M50 2.11l-7.66 21.31h.24L50 33.24l7.42-9.82h.24z"></path>
        </svg>
      </Background>
    </Wrapper>
  );
}
