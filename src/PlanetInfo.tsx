// src/PlanetInfo.tsx
import React from 'react';
import { usePlanetStore } from './store';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

interface PlanetDetails {
  description: string;
  image: string;
}

const planetDetails: { [key: string]: PlanetDetails } = {
  Mercury: {
    description: 'Mercury is the closest planet to the Sun.',
    image: '/images/mercury.jpg',
  },
  Venus: {
    description: 'Venus is the second planet from the Sun.',
    image: '/images/venus.jpg',
  },
  Earth: {
    description: 'Earth is our home planet.',
    image: '/images/earth.jpg',
  },
  // Add details for other planets
};

const PlanetInfo: React.FC = () => {
  const { selectedPlanet } = usePlanetStore();
  if (!selectedPlanet) return null;

  const planet = planetDetails[selectedPlanet];

  return (
    <Card
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        maxWidth: 345,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={planet.image}
        alt={selectedPlanet}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {selectedPlanet}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {planet.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PlanetInfo;
