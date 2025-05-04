import React, { useState } from 'react';
import { usePlanetStore } from '../store';
import { planetData } from '../Planets';
import '../styles/main.scss';

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

// Function to calculate distance between two points in 3D space
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
  
  // For actual distance, we need their current positions in 3D space
  // instead of just orbit radius difference
  let planet1Orbit = planet1Data.realOrbitRadius;
  let planet2Orbit = planet2Data.realOrbitRadius;
  
  // If one is Sun, just use the current orbit radius of the other
  if (planet1 === 'Sun') return planet2Orbit;
  if (planet2 === 'Sun') return planet1Orbit;
  
  // For two planets, use the triangular approximation
  return Math.abs(planet1Orbit - planet2Orbit);
};

// Function to calculate perihelion and aphelion
const calculateOrbitalExtremes = (planet: string): { perihelion: number, aphelion: number } | null => {
  const planetInfo = planetData.find(p => p.name === planet);
  
  if (!planetInfo || planet === 'Sun') return null;
  
  const semiMajorAxis = planetInfo.realOrbitRadius;
  const eccentricity = planetInfo.eccentricity ?? 0;
  
  // Perihelion = a(1-e)
  const perihelion = semiMajorAxis * (1 - eccentricity);
  
  // Aphelion = a(1+e)
  const aphelion = semiMajorAxis * (1 + eccentricity);
  
  return { perihelion, aphelion };
};

// Icons
const IconInfo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const IconDatabase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconMap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
    <line x1="8" y1="2" x2="8" y2="18"></line>
    <line x1="16" y1="6" x2="16" y2="22"></line>
  </svg>
);

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconDistance = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3l4 4-4 4"></path>
    <path d="M7 21l-4-4 4-4"></path>
    <path d="M21 7L3 7"></path>
    <path d="M3 17L21 17"></path>
  </svg>
);

const IconPlanet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="1.05" y1="12" x2="7" y2="12"></line>
    <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
  </svg>
);

// Main component
const PlanetInfo: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    selectedPlanet,
    targetPlanet,
    setTargetPlanet,
    planetPositions,
    setSelectedPlanet
  } = usePlanetStore();

  if (!selectedPlanet && !isCollapsed) {
    // If no planet is selected, show a minimized indicator
    return (
      <div className="info-panel__minimized" onClick={() => setIsCollapsed(false)}>
        <IconPlanet />
      </div>
    );
  }

  // If panel is collapsed, show only a button
  if (isCollapsed) {
    return (
      <div className="info-panel__minimized" onClick={() => setIsCollapsed(false)}>
        <IconPlanet />
      </div>
    );
  }

  if (!selectedPlanet) return null;

  // We get the selected planet details from the planetDetails object
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

  const planet = planetDetails[selectedPlanet];

  if (!planet) {
    return (
      <div className="info-panel">
        <div className="info-panel__header">
          <div className="info-panel__header-overlay">
            <h2>Unknown Object</h2>
            <p>No details available for {selectedPlanet}</p>
          </div>
          <button className="close-button" onClick={() => setSelectedPlanet(null)}>
            <IconX />
          </button>
        </div>
      </div>
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
  
  // Get orbital extreme distances (perihelion and aphelion)
  const orbitalExtremes = calculateOrbitalExtremes(selectedPlanet);

  return (
    <div className="info-panel">
      <div className="info-panel__header">
        <img src={planet.image} alt={selectedPlanet} />
        <div className="info-panel__header-overlay">
          <h2>{selectedPlanet}</h2>
          <p>{planet.description}</p>
        </div>
        <button className="close-button" onClick={() => setIsCollapsed(true)}>
          <IconX />
        </button>
      </div>

      <div className="info-panel__content">
        <div className="info-panel__section">
          <h3 className="info-panel__section-title">
            <IconInfo />
            Key Facts
          </h3>
          <ul>
            {Object.entries(planet.details).map(([key, value]) => (
              <li key={key}>
                <span className="property">{key}</span>
                <span className="value">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {planet.scientificData && (
          <div className="info-panel__section">
            <h3 className="info-panel__section-title">
              <IconDatabase />
              Scientific Data
            </h3>
            <ul>
              {Object.entries(planet.scientificData).map(([key, value]) => (
                <li key={key}>
                  <span className="property">{key}</span>
                  <span className="value">{value.toString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="info-panel__section">
          <h3 className="info-panel__section-title">
            <IconMap />
            Current Position
          </h3>
          <ul>
            {distanceToSun && selectedPlanet !== 'Sun' && (
              <li>
                <span className="property">Distance to Sun</span>
                <span className="value">{distanceToSunKM} km</span>
              </li>
            )}
            {distanceToTarget && (
              <li>
                <span className="property">Distance to {targetPlanet}</span>
                <span className="value">{distanceToTargetKM} km</span>
              </li>
            )}
            {orbitalExtremes && (
              <>
                <li>
                  <span className="property">Perihelion</span>
                  <span className="value">{(orbitalExtremes.perihelion * 1_000_000).toLocaleString()} km</span>
                </li>
                <li>
                  <span className="property">Aphelion</span>
                  <span className="value">{(orbitalExtremes.aphelion * 1_000_000).toLocaleString()} km</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="planet-selector">
          <label htmlFor="target-planet">Calculate Distance To</label>
          <select
            id="target-planet"
            value={targetPlanet || ''}
            onChange={(e) => {
              const value = e.target.value;
              setTargetPlanet(value === '' ? null : value);
            }}
          >
            <option value="">None</option>
            {Object.keys(planetDetails)
              .filter((name) => name !== selectedPlanet)
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>

          {distanceToTarget && (
            <div className="distance-badge">
              <IconDistance />
              <span>{distanceToTargetKM} km to {targetPlanet}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo; 