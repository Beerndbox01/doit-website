import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { styleReset } from 'react95';
import original from 'react95/dist/themes/original';
import { createGlobalStyle } from 'styled-components';

import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

import App from './App';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  * {
    font-family: 'ms_sans_serif', sans-serif;
    box-sizing: border-box;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
  }
  body {
    margin: 0;
    padding: 0;
    background: #008080;
    min-height: 100vh;
    overflow-x: hidden;
  }
  html {
    scroll-behavior: smooth;
  }
  ::-webkit-scrollbar {
    width: 16px;
  }
  ::-webkit-scrollbar-track {
    background: #c0c0c0;
    border-left: 1px solid #808080;
  }
  ::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    border-right-color: #808080;
    border-bottom-color: #808080;
  }
  ::-webkit-scrollbar-button {
    background: #c0c0c0;
    border: 2px outset #dfdfdf;
    border-right-color: #808080;
    border-bottom-color: #808080;
    height: 16px;
  }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
