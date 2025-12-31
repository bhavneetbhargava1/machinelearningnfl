# machinelearningnfl
Predict NFL game winners using machine learning and Vegas betting data. Combines team stats, Elo ratings, weather, and spreads to find when the market gets it wrong—revealing data-driven edges in real-world sports outcomes.

## Front-End Application

A modern React-based front-end for visualizing NFL win predictions powered by:
- **CNN + Cosine Similarity Transformer** for team analysis
- **Markov Chain Decision Tree** for game simulation

### Features

- **Dashboard**: Real-time win predictions with probability visualizations
- **Team Comparison**: Side-by-side team analysis with radar charts and statistical comparisons
- **Game Simulation**: 4-quarter game simulation with win probability tracking

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Tech Stack

- React 18
- Vite
- React Router
- Recharts (for visualizations)
- Tailwind CSS
- Lucide React (icons)
