import React from 'react';
import ReactDOM from 'react-dom/client';
import { styleReset } from 'react95';
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
    width: 18px;
    height: 18px;
  }
  ::-webkit-scrollbar-track {
    background: repeating-conic-gradient(#c0c0c0 0% 25%, #dfdfdf 0% 50%) 50% / 2px 2px;
    border-left: 1px solid #808080;
  }
  ::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 2px outset #fff;
    border-right-color: #404040;
    border-bottom-color: #404040;
    min-height: 30px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }
  ::-webkit-scrollbar-button:single-button {
    background: #c0c0c0;
    border: 2px outset #fff;
    border-right-color: #404040;
    border-bottom-color: #404040;
    height: 18px;
    width: 18px;
    display: block;
  }
  ::-webkit-scrollbar-button:single-button:hover {
    background: #d0d0d0;
  }
  ::-webkit-scrollbar-button:single-button:active {
    border-style: inset;
    border-color: #808080;
  }
  ::-webkit-scrollbar-button:single-button:vertical:decrement {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpolygon points='4,0 0,4 8,4' fill='%23000'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
  ::-webkit-scrollbar-button:single-button:vertical:increment {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4'%3E%3Cpolygon points='0,0 8,0 4,4' fill='%23000'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
  ::-webkit-scrollbar-corner {
    background: #c0c0c0;
  }
  /* Firefox scrollbar */
  * {
    scrollbar-width: auto;
    scrollbar-color: #c0c0c0 #dfdfdf;
  }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
