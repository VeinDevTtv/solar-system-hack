// File Name: App.tsx
// Author: Abdelkarim
// Purpose: Main application component that includes the SolarSystem.
// Date: 10/26/2024

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SolarSystem from './SolarSystem';
import ReactHowler from 'react-howler';
import './styles/main.scss';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactHowler
        src="/audio/space-music.mp3"
        playing={true}
        loop={true}
        volume={0.15}
      />
      <SolarSystem />
    </ThemeProvider>
  );
}

export default App;
