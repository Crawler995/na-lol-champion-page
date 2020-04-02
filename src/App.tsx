import React from 'react';
import { createGlobalStyle } from 'styled-components';
import Skin from './section/Skin';
import './font.css';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0px;

    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-size: 13px;
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />

      <Skin />
    </div>
  );
}

export default App;
