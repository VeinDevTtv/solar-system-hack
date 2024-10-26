# Solar System Visualization
## Ended project on 10/26/2024 at 12:00 PM

## Made by Abdelkarim

## Overview
This project is a 3D visualization of the solar system built using React, Three.js, and related technologies. It allows users to explore the solar system, view planets and their moons, and get detailed information about each celestial body. Users can also calculate distances between planets and the Sun or other planets.

Languages and Technologies Used
TypeScript
React
Three.js
@react-three/fiber
@react-three/drei
@react-three/postprocessing
Zustand (state management)
Material-UI (MUI) (for UI components)
Node.js and npm (for package management and running the application)
Project Structure and File Descriptions
src/
App.tsx
The root component that brings together the main components of the application.
SolarSystem.tsx
Sets up the Three.js Canvas and includes camera settings, lighting, and global effects like stars and bloom. It imports and renders the Planets component.
Planets.tsx
Contains all the logic and data for rendering the planets and their moons. It handles the creation of planetary bodies, their orbits, rotations, and positions. It also updates the positions in the global store for distance calculations.
Orbit.tsx
A helper component that renders the orbital paths of planets around the Sun.
PlanetInfo.tsx
Displays detailed information about the selected planet, including description, images, and calculated distances to the Sun or another selected planet. It includes a dropdown menu to select a target planet for distance calculations.
store.ts
Manages the global state using zustand. It keeps track of the selected planet, target planet, and the positions of all planets for distance calculations.
index.tsx
The entry point of the React application, rendering the App component into the DOM.
public/
textures/
Contains texture images for all planets, moons, and Saturn's rings.
images/
Contains images used in the information panel for each celestial body.
package.json
Lists all the dependencies and scripts needed to run the application.
How to Run the Project
Install Dependencies

bash
Copy code
npm install
Start the Application

bash
Copy code
npm start
Access the Application

Open your web browser and navigate to http://localhost:3000.
Features
3D Visualization of the Solar System

Planets orbit around the Sun with realistic speeds and distances (scaled for visualization).
Planets rotate on their axes.
Moons orbit their respective planets.
Saturn has visible rings.
Interactive Elements

Click on planets or moons to view detailed information.
Information panel displays descriptions, images, and key details.
Dropdown menu to select a target planet for distance calculations.
Distance Calculations

Displays the distance from the selected planet to the Sun.
Calculates and displays the distance to another selected planet.
User Interface

Uses Material-UI components for a clean and modern interface.
Includes orbit controls for zooming and rotating the view.
Dependencies and Libraries
React and React-DOM: For building the user interface.
TypeScript: Adds static typing to JavaScript.
Three.js: A 3D library that makes WebGL simpler.
@react-three/fiber: A React renderer for Three.js.
@react-three/drei: Useful helpers for @react-three/fiber.
@react-three/postprocessing: Postprocessing effects for Three.js in React.
Zustand: A small, fast, and scalable bearbones state-management solution.
Material-UI: A popular React UI framework with ready-to-use components.
Acknowledgments
Textures and Images: All textures and images are used for educational purposes.
Open-Source Libraries: Thanks to the maintainers and contributors of the open-source libraries used in this project.
Contact
For any questions or feedback, please contact Abdelkarim.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
