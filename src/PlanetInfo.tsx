// src/PlanetInfo.tsx
import React from 'react';
import { usePlanetStore } from './store';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface PlanetDetails {
  description: string;
  image: string;
  details: {
    [key: string]: string;
  };
}

const planetDetails: { [key: string]: PlanetDetails } = {
  // ... existing planet details
  Moon: {
    description: "Earth's only natural satellite.",
    image: '/images/moon.jpg',
    details: {
      'Mass (10^22 kg)': '0.073',
      'Diameter (km)': '3,475',
      'Orbit Period (days)': '27.3',
      'Surface Temperature (°C)': '-173 to 127',
    },
  },
  Phobos: {
    description: "The larger and closer of Mars' moons.",
    image: '/images/phobos.jpg',
    details: {
      'Mass (10^15 kg)': '1.0659',
      'Diameter (km)': '22.2',
      'Orbit Period (days)': '0.3189',
      'Surface Temperature (°C)': '-4 to -112',
    },
  },
  Deimos: {
    description: "The smaller and farther of Mars' moons.",
    image: '/images/deimos.jpg',
    details: {
      'Mass (10^15 kg)': '0.147',
      'Diameter (km)': '12.6',
      'Orbit Period (days)': '1.263',
      'Surface Temperature (°C)': '-4 to -112',
    },
  },
};

const PlanetInfo: React.FC = () => {
  const { selectedPlanet } = usePlanetStore();
  if (!selectedPlanet) return null;

  const planet = planetDetails[selectedPlanet];

  if (!planet) {
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
        <CardContent>
          <Typography variant="h6" color="error">
            No details available for {selectedPlanet}.
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
        <Typography variant="body2" color="text.secondary" paragraph>
          {planet.description}
        </Typography>
        <List dense>
          {Object.entries(planet.details).map(([key, value]) => (
            <ListItem key={key} disableGutters>
              <ListItemText
                primary={`${key}:`}
                secondary={value}
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PlanetInfo;
