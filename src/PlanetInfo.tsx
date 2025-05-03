// File Name: PlanetInfo.tsx
// Author: Abdelkarim
// Purpose: Displays detailed information about the selected planet,
// including distances in scene units and approximate kilometers.
// Date: 10/26/2024

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
} from '@mui/material';
import { planetData } from './Planets';

interface PlanetDetails {
  description: string;
  image: string;
  details: {
    [key: string]: string;
  };
  scientificData?: {
    [key: string]: string | number;
  };
}

// Convert AU to million kilometers
const AU_TO_MKM = 149.6;

// More accurate astronomical data
const planetDetails: { [key: string]: PlanetDetails } = {
  Sun: {
    description: 'The Sun is the star at the center of our solar system, a nearly perfect sphere of hot plasma.',
    image: '/images/sun.jpg',
    details: {
      'Mass': '1.989 × 10^30 kg',
      'Diameter': '1,392,700 km',
      'Surface Temperature': '5,500°C',
      'Core Temperature': '15,000,000°C',
      'Age': '~4.6 billion years',
      'Rotation Period (Equator)': '25.4 days',
    },
    scientificData: {
      'Absolute Magnitude': 4.83,
      'Luminosity': '3.828 × 10^26 W',
      'Spectral Classification': 'G2V',
      'Solar Constant': '1,361 W/m²',
    }
  },
  Mercury: {
    description: 'Mercury is the smallest and innermost planet in the Solar System, with extreme temperature variations.',
    image: '/images/mercury.jpg',
    details: {
      'Mass': '3.3011 × 10^23 kg',
      'Diameter': '4,879 km',
      'Moons': '0',
      'Orbit Period': '88 days',
      'Rotation Period': '58.65 days',
      'Surface Temperature': '-173 to 427°C',
    },
    scientificData: {
      'Axial Tilt': '0.034°',
      'Orbital Eccentricity': 0.2056,
      'Escape Velocity': '4.3 km/s',
      'Surface Gravity': '3.7 m/s²',
    }
  },
  Venus: {
    description: 'Venus is the second planet from the Sun, known for its thick toxic atmosphere and extreme greenhouse effect.',
    image: '/images/venus.jpg',
    details: {
      'Mass': '4.8675 × 10^24 kg',
      'Diameter': '12,104 km',
      'Moons': '0',
      'Orbit Period': '224.7 days',
      'Rotation Period': '243 days (retrograde)',
      'Surface Temperature': '462°C',
    },
    scientificData: {
      'Axial Tilt': '177.4°',
      'Orbital Eccentricity': 0.0067,
      'Escape Velocity': '10.36 km/s',
      'Surface Gravity': '8.87 m/s²',
      'Atmospheric Composition': '96.5% CO₂, 3.5% N₂',
    }
  },
  Earth: {
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
    image: '/images/earth.jpg',
    details: {
      'Mass': '5.97237 × 10^24 kg',
      'Diameter': '12,756 km',
      'Moons': '1',
      'Orbit Period': '365.24 days',
      'Rotation Period': '23.93 hours',
      'Surface Temperature': '-88 to 58°C',
    },
    scientificData: {
      'Axial Tilt': '23.4°',
      'Orbital Eccentricity': 0.0167,
      'Escape Velocity': '11.2 km/s',
      'Surface Gravity': '9.8 m/s²',
      'Atmospheric Composition': '78% N₂, 21% O₂, 1% other',
    }
  },
  Mars: {
    description: 'Mars is the fourth planet from the Sun, often called the "Red Planet" due to its reddish appearance.',
    image: '/images/mars.jpg',
    details: {
      'Mass': '6.4171 × 10^23 kg',
      'Diameter': '6,792 km',
      'Moons': '2',
      'Orbit Period': '687 days',
      'Rotation Period': '24.62 hours',
      'Surface Temperature': '-87 to -5°C',
    },
    scientificData: {
      'Axial Tilt': '25.2°',
      'Orbital Eccentricity': 0.0935,
      'Escape Velocity': '5.0 km/s',
      'Surface Gravity': '3.7 m/s²',
      'Atmospheric Composition': '95.3% CO₂, 2.7% N₂, 2% other',
    }
  },
  Jupiter: {
    description: 'Jupiter is the largest planet in our solar system, a gas giant with a mass more than 2.5 times all other planets combined.',
    image: '/images/jupiter.jpg',
    details: {
      'Mass': '1.8982 × 10^27 kg',
      'Diameter': '142,984 km',
      'Moons': '79+',
      'Orbit Period': '11.86 years',
      'Rotation Period': '9.93 hours',
      'Temperature (Cloud tops)': '-108°C',
    },
    scientificData: {
      'Axial Tilt': '3.1°',
      'Orbital Eccentricity': 0.0489,
      'Escape Velocity': '59.5 km/s',
      'Surface Gravity': '24.8 m/s²',
      'Atmospheric Composition': '89% H₂, 10% He, 1% other',
    }
  },
  Saturn: {
    description: 'Saturn is known for its extensive ring system, and is the second-largest planet in the Solar System.',
    image: '/images/saturn.jpg',
    details: {
      'Mass': '5.6834 × 10^26 kg',
      'Diameter': '120,536 km',
      'Moons': '82+',
      'Orbit Period': '29.46 years',
      'Rotation Period': '10.7 hours',
      'Temperature (Cloud tops)': '-139°C',
    },
    scientificData: {
      'Axial Tilt': '26.7°',
      'Orbital Eccentricity': 0.0565,
      'Escape Velocity': '35.5 km/s',
      'Surface Gravity': '10.4 m/s²',
      'Ring System': '7,000 km to 80,000 km from planet',
      'Atmospheric Composition': '96% H₂, 3% He, 1% other',
    }
  },
  Uranus: {
    description: 'Uranus is the seventh planet from the Sun and rotates on its side, with its axis tilted nearly 98 degrees.',
    image: '/images/uranus.jpg',
    details: {
      'Mass': '8.6810 × 10^25 kg',
      'Diameter': '51,118 km',
      'Moons': '27',
      'Orbit Period': '84.01 years',
      'Rotation Period': '17.24 hours (retrograde)',
      'Temperature (Cloud tops)': '-195°C',
    },
    scientificData: {
      'Axial Tilt': '97.8°',
      'Orbital Eccentricity': 0.0457,
      'Escape Velocity': '21.3 km/s',
      'Surface Gravity': '8.7 m/s²',
      'Ring System': '38,000 km to 98,000 km from planet',
      'Atmospheric Composition': '83% H₂, 15% He, 2% CH₄',
    }
  },
  Neptune: {
    description: 'Neptune is the eighth and farthest planet from the Sun, and is the densest of the gas giants.',
    image: '/images/neptune.jpg',
    details: {
      'Mass': '1.02413 × 10^26 kg',
      'Diameter': '49,528 km',
      'Moons': '14',
      'Orbit Period': '164.8 years',
      'Rotation Period': '16.11 hours',
      'Temperature (Cloud tops)': '-201°C',
    },
    scientificData: {
      'Axial Tilt': '28.3°',
      'Orbital Eccentricity': 0.0113,
      'Escape Velocity': '23.5 km/s',
      'Surface Gravity': '11.2 m/s²',
      'Ring System': '53,000 km to 63,000 km from planet',
      'Atmospheric Composition': '80% H₂, 19% He, 1% CH₄',
    }
  },
  Moon: {
    description: "Earth's only natural satellite and the fifth-largest satellite in the Solar System.",
    image: '/images/moon.jpg',
    details: {
      'Mass': '7.342 × 10^22 kg',
      'Diameter': '3,475 km',
      'Orbit Period': '27.3 days',
      'Rotation Period': '27.3 days (tidally locked)',
      'Surface Temperature': '-173 to 127°C',
      'Distance from Earth': '384,400 km',
    },
    scientificData: {
      'Orbital Eccentricity': 0.0549,
      'Escape Velocity': '2.38 km/s',
      'Surface Gravity': '1.62 m/s²',
      'Orbital Inclination': '5.14° to ecliptic',
    }
  },
  Phobos: {
    description: "The larger and closer of Mars' two moons, orbiting just 6,000 km above the surface.",
    image: '/images/phobos.jpg',
    details: {
      'Mass': '1.0659 × 10^16 kg',
      'Dimensions': '27 × 22 × 18 km',
      'Orbit Period': '7.66 hours',
      'Rotation Period': '7.66 hours (tidally locked)',
      'Surface Temperature': '-4 to -112°C',
      'Distance from Mars': '9,376 km',
    },
    scientificData: {
      'Orbital Eccentricity': 0.0151,
      'Escape Velocity': '0.011 km/s',
      'Surface Gravity': '0.0057 m/s²',
      'Orbit Decay': '~1.8 m per century',
    }
  },
  Deimos: {
    description: "The smaller and farther of Mars' two moons.",
    image: '/images/deimos.jpg',
    details: {
      'Mass': '1.4762 × 10^15 kg',
      'Dimensions': '15 × 12 × 11 km',
      'Orbit Period': '30.3 hours',
      'Rotation Period': '30.3 hours (tidally locked)',
      'Surface Temperature': '-4 to -112°C',
      'Distance from Mars': '23,463 km',
    },
    scientificData: {
      'Orbital Eccentricity': 0.00033,
      'Escape Velocity': '0.005 km/s',
      'Surface Gravity': '0.003 m/s²',
    }
  },
};

// Find the absolute distance between two objects in space
const calculateDistance = (pos1: [number, number, number], pos2: [number, number, number]): number => {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Calculate real-world distance between two planets
const calculateRealDistance = (planet1: string, planet2: string): number | null => {
  const planet1Data = planetData.find(p => p.name === planet1);
  const planet2Data = planetData.find(p => p.name === planet2);
  
  if (!planet1Data || !planet2Data) return null;
  
  // For moons, find their parent planet
  let planet1Orbit = planet1Data.realOrbitRadius;
  let planet2Orbit = planet2Data.realOrbitRadius;
  
  return Math.abs(planet1Orbit - planet2Orbit);
};

const PlanetInfo: React.FC = () => {
  const {
    selectedPlanet,
    targetPlanet,
    setTargetPlanet,
    planetPositions,
  } = usePlanetStore();

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

  // Compute distance to Sun
  const planetPosition = planetPositions[selectedPlanet];
  const sunPosition = planetPositions['Sun'] || [0, 0, 0];

  let distanceToSun = null;
  let distanceToSunKM = null;

  if (planetPosition) {
    const distance = calculateDistance(planetPosition, sunPosition);
    distanceToSun = distance.toFixed(2); // Scene units

    // Get real orbit radius from planetData
    const planetInfo = planetData.find((p) => p.name === selectedPlanet);
    if (planetInfo) {
      distanceToSunKM = (planetInfo.realOrbitRadius * 1_000_000).toLocaleString(); // in km
    }
  }

  // Compute distance to target planet
  let distanceToTarget = null;
  let distanceToTargetKM = null;

  if (targetPlanet && planetPositions[targetPlanet] && planetPosition) {
    const targetPosition = planetPositions[targetPlanet];
    const distance = calculateDistance(planetPosition, targetPosition);
    distanceToTarget = distance.toFixed(2); // Scene units

    // Calculate real-world distance
    const realDistance = calculateRealDistance(selectedPlanet, targetPlanet);
    if (realDistance !== null) {
      distanceToTargetKM = (realDistance * 1_000_000).toLocaleString(); // in km
    }
  }

  return (
    <Card
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        maxWidth: 400,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        maxHeight: '80vh',
        overflow: 'auto',
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
        
        <Typography variant="subtitle1" color="text.primary" sx={{ mt: 2, mb: 1 }}>
          Key Facts
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
        
        {planet.scientificData && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
              Scientific Data
            </Typography>
            <List dense>
              {Object.entries(planet.scientificData).map(([key, value]) => (
                <ListItem key={key} disableGutters>
                  <ListItemText
                    primary={`${key}:`}
                    secondary={value.toString()}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="text.primary" sx={{ mb: 1 }}>
          Current Position
        </Typography>
        <List dense>
          {distanceToSun && (
            <ListItem disableGutters>
              <ListItemText
                primary="Distance to Sun:"
                secondary={`${distanceToSun} units (${distanceToSunKM} km)`}
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          )}
          {distanceToTarget && (
            <ListItem disableGutters>
              <ListItemText
                primary={`Distance to ${targetPlanet}:`}
                secondary={`${distanceToTarget} units (${distanceToTargetKM} km)`}
                primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="target-planet-label">Calculate Distance To</InputLabel>
            <Select
              labelId="target-planet-label"
              value={targetPlanet || ''}
              label="Calculate Distance To"
              onChange={(e) => setTargetPlanet(e.target.value || null)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.keys(planetDetails)
                .filter((name) => name !== selectedPlanet)
                .map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlanetInfo;
