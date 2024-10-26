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
  Sun: {
    description: 'The Sun is the star at the center of our solar system.',
    image: '/images/sun.jpg',
    details: {
      'Mass (10^24 kg)': '1,989,100',
      'Diameter (km)': '1,392,700',
      'Moons': 'N/A',
      'Orbit Period (days)': 'N/A',
      'Surface Temperature (°C)': '5,500',
    },
  },
  Mercury: {
    description: 'Mercury is the closest planet to the Sun.',
    image: '/images/mercury.jpg',
    details: {
      'Mass (10^24 kg)': '0.330',
      'Diameter (km)': '4,879',
      'Moons': '0',
      'Orbit Period (days)': '88',
      'Surface Temperature (°C)': '-173 to 427',
    },
  },
  Venus: {
    description: 'Venus is the second planet from the Sun.',
    image: '/images/venus.jpg',
    details: {
      'Mass (10^24 kg)': '4.87',
      'Diameter (km)': '12,104',
      'Moons': '0',
      'Orbit Period (days)': '225',
      'Surface Temperature (°C)': '462',
    },
  },
  Earth: {
    description: 'Earth is our home planet.',
    image: '/images/earth.jpg',
    details: {
      'Mass (10^24 kg)': '5.97',
      'Diameter (km)': '12,756',
      'Moons': '1',
      'Orbit Period (days)': '365.24',
      'Surface Temperature (°C)': '-88 to 58',
    },
  },
  Mars: {
    description: 'Mars is known as the Red Planet.',
    image: '/images/mars.jpg',
    details: {
      'Mass (10^24 kg)': '0.642',
      'Diameter (km)': '6,792',
      'Moons': '2',
      'Orbit Period (days)': '687',
      'Surface Temperature (°C)': '-87 to -5',
    },
  },
  Jupiter: {
    description: 'Jupiter is the largest planet in our solar system.',
    image: '/images/jupiter.jpg',
    details: {
      'Mass (10^24 kg)': '1,898',
      'Diameter (km)': '142,984',
      'Moons': '79',
      'Orbit Period (days)': '4,333',
      'Surface Temperature (°C)': '-108',
    },
  },
  Saturn: {
    description: 'Saturn is famous for its beautiful rings.',
    image: '/images/saturn.jpg',
    details: {
      'Mass (10^24 kg)': '568',
      'Diameter (km)': '120,536',
      'Moons': '82',
      'Orbit Period (days)': '10,756',
      'Surface Temperature (°C)': '-139',
    },
  },
  Uranus: {
    description: 'Uranus has a unique sideways rotation.',
    image: '/images/uranus.jpg',
    details: {
      'Mass (10^24 kg)': '86.8',
      'Diameter (km)': '51,118',
      'Moons': '27',
      'Orbit Period (days)': '30,687',
      'Surface Temperature (°C)': '-195',
    },
  },
  Neptune: {
    description: 'Neptune is known for its intense blue color.',
    image: '/images/neptune.jpg',
    details: {
      'Mass (10^24 kg)': '102',
      'Diameter (km)': '49,528',
      'Moons': '14',
      'Orbit Period (days)': '60,190',
      'Surface Temperature (°C)': '-201',
    },
  },
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
