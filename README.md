# Cinematic Weather

A premium, immersive weather application that brings forecasts to life with dynamic cinematic backgrounds, particle effects, and advanced data visualization. Built with React, TypeScript, and Tailwind CSS.

![Cinematic Weather Preview](https://images.unsplash.com/photo-1592210454132-7284739d931c?q=80&w=1000&auto=format&fit=crop)

## Features

*   **Cinematic Backgrounds**: High-resolution, mood-setting photography that adapts to the current weather condition (Clear, Rain, Snow, Thunderstorm, Clouds, etc.).
*   **Dynamic Visual Effects**: CSS-driven particle systems for rain, snow, lightning, and sun glares that overlay the background for depth.
*   **Real-time Data**: Fetches precise weather data using the Open-Meteo API (no API key required).
*   **Advanced Metrics**:
    *   Interactive 24-hour temperature forecasts.
    *   Detailed precipitation probability charts with visual warnings for high rain chances.
    *   Wind, Humidity, Visibility, UV Index, and Pressure metrics.
*   **Location Services**: Automatic geolocation support and manual city search functionality.
*   **Unit Conversion**: Seamless toggle between Imperial (°F, mph) and Metric (°C, km/h) systems.
*   **Responsive Design**: A polished UI that scales from mobile devices to large desktop screens.

## Tech Stack

*   **Framework**: [React 18](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Visualization**: [Recharts](https://recharts.org/)
*   **Icons**: [Google Material Symbols](https://fonts.google.com/icons)
*   **Build Tool**: [Vite](https://vitejs.dev/)

## Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/cinematic-weather.git
    cd cinematic-weather
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Deployment (GitHub Pages)

This project is configured for easy deployment to GitHub Pages.

1.  **Update `vite.config.ts` (Optional)**:
    If you are deploying to a user site (e.g., `username.github.io`), the `base` in `vite.config.ts` can remain `'./'`.
    If you are deploying to a project site (e.g., `username.github.io/repo-name`), the current configuration `'./'` should generally work, but you can explicitly set it to `'/repo-name/'`.

2.  **Deploy Command**:
    The project includes a `gh-pages` script. Simply run:
    ```bash
    npm run deploy
    ```
    This command will:
    *   Build the project (TypeScript compilation + Vite build).
    *   Push the contents of the `dist` folder to the `gh-pages` branch of your repository.

3.  **GitHub Settings**:
    Go to your repository **Settings > Pages** and ensure the source is set to the `gh-pages` branch.

## Project Structure

```
├── components/          # React UI components (Header, Hero, Charts, etc.)
├── services/           # API integration logic
├── index.tsx           # Application entry point
├── App.tsx             # Main application layout and state
├── types.ts            # TypeScript definitions
└── index.html          # HTML entry file
```

## License

Distributed under the MIT License. See `LICENSE` for more information.