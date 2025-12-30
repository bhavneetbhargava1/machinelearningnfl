import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import TeamComparison from './components/TeamComparison'
import GameSimulation from './components/GameSimulation'
import { BarChart3, Users, Play } from 'lucide-react'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">NFL Win Prediction</h1>
              </div>
              <div className="flex space-x-6">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/comparison"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Team Comparison
                </Link>
                <Link
                  to="/simulation"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Game Simulation
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/comparison" element={<TeamComparison />} />
            <Route path="/simulation" element={<GameSimulation />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App


