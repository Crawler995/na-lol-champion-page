import styled from 'styled-components';
import React, { useState } from 'react';
import AbilitySelect from './AbilitySelect';
import AbilityInfo from './AbilityInfo';
import AbilityShow from './AbilityShow';

const Wrapper = styled.section`
  position: relative;
  display: flex;
  padding: 60px 100px;

  background-color: rgb(0, 9, 19);
`;

const Left = styled.div`
  flex-grow: 1;
`;

const Right = styled.div`
  flex-grow: 1;
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
        <AbilitySelect
          iconSrcs={abilitiesInfo.map(info => info.iconSrc)}
          onCurIndexChange={curIndex => setCurIndex(curIndex)}
        />
        <AbilityInfo curIndex={curIndex} infos={abilitiesInfo} />
      </Left>

      <Right>
        <AbilityShow infos={abilitiesInfo} curIndex={curIndex} />
      </Right>
    </Wrapper>
  );
}
