// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SolarSystem from './SolarSystem';
import PlanetInfo from './PlanetInfo';
import ReactHowler from 'react-howler';

const theme = createTheme({
  palette: {
    mode: 'dark',
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
        volume={0.2}
      />
      <SolarSystem />
      <PlanetInfo />
    </ThemeProvider>
  );
}

export default App;
