import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.section`
  position: relative;

  background-color: rgb(0, 9, 19);
`;

const ImageContainer = styled.div`
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 80vh;
  max-height: 800px;
  overflow: hidden;
`;

const BlurBackground = styled.img`
  position: absolute;
  display: block;
  left: -5%;
  top: -5%;
  width: 110%;
  height: 110%;

  filter: blur(8px);
  mask-image: linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 98%);
`;

const ClearBackground = styled.img`
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0px 3.75rem;

  mask-image: linear-gradient(rgb(0, 0, 0) 65%, rgba(0, 0, 0, 0) 98%);
  object-fit: cover;
`;

const TitleContainer = styled.h1`
  position: relative;
  display: block;
  padding: 0px 100px;
  margin-top: -5rem;

  &::before {
    content: '';
    position: relative;
    display: inline-block;
    top: 50%;
    width: 25%;
    height: 1px;

    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ChampionSecondName = styled.div`
  margin: 0 auto;
  text-align: center;
  font-style: italic;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #fff;
`;

const ChampionFirstName = styled.div`
  margin: 0 auto;
  text-align: center;
  font-style: italic;
  font-family: 'Beaufort for LOL', serif;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  color: #fff;
`;

const TextContainer = styled.div`
  display: flex;
  position: relative;
  padding: 70px;
  margin: 0 100px 0 100px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top: none;
`;

const Attribute = styled.div`
  flex: 1;
  padding: 3.75rem;
`;

const DivideLine = styled.div`
  width: 1px;

  background-color: rgba(255, 255, 255, 0.2);
`;

const Story = styled.div`
  flex: 1;
  padding: 3.75rem;
`;

export default function Introduction() {
  return (
    <Wrapper>
      <ImageContainer>
        <BlurBackground src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_0.jpg" />
        <ClearBackground src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Vayne_0.jpg" />
      </ImageContainer>
      <TitleContainer>
        <ChampionSecondName>THE NIGHT HUNTER</ChampionSecondName>
        <ChampionFirstName>VAYNE</ChampionFirstName>
      </TitleContainer>
      <TextContainer>
        <Attribute></Attribute>
        <DivideLine />
        <Story></Story>
      </TextContainer>
    </Wrapper>
  );
}
