import { useState } from 'react'
import { Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const GameSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentQuarter, setCurrentQuarter] = useState(1)
  const [gameTime, setGameTime] = useState(900) // 15 minutes in seconds
  const [simulationData, setSimulationData] = useState([])

  // Mock simulation data - in real app, this would come from your Markov Chain Decision Tree
  const generateSimulation = () => {
    const quarters = [
      {
        quarter: 1,
        homeScore: 7,
        awayScore: 3,
        homeWinProb: [0.52, 0.55, 0.58, 0.60, 0.62, 0.65, 0.68, 0.70],
        awayWinProb: [0.48, 0.45, 0.42, 0.40, 0.38, 0.35, 0.32, 0.30],
        events: [
          { time: '15:00', event: 'Kickoff', team: 'Away' },
          { time: '12:34', event: 'Touchdown', team: 'Home', score: '7-0' },
          { time: '8:21', event: 'Field Goal', team: 'Away', score: '7-3' },
          { time: '3:45', event: 'Punt', team: 'Home' }
        ]
      },
      {
        quarter: 2,
        homeScore: 14,
        awayScore: 10,
        homeWinProb: [0.70, 0.72, 0.68, 0.65, 0.67, 0.70, 0.73, 0.75],
        awayWinProb: [0.30, 0.28, 0.32, 0.35, 0.33, 0.30, 0.27, 0.25],
        events: [
          { time: '15:00', event: 'Touchdown', team: 'Home', score: '14-3' },
          { time: '11:22', event: 'Touchdown', team: 'Away', score: '14-10' },
          { time: '6:15', event: 'Interception', team: 'Away' },
          { time: '2:30', event: 'Field Goal Attempt - Missed', team: 'Home' }
        ]
      },
      {
        quarter: 3,
        homeScore: 21,
        awayScore: 17,
        homeWinProb: [0.75, 0.77, 0.74, 0.72, 0.75, 0.78, 0.80, 0.82],
        awayWinProb: [0.25, 0.23, 0.26, 0.28, 0.25, 0.22, 0.20, 0.18],
        events: [
          { time: '15:00', event: 'Touchdown', team: 'Away', score: '14-17' },
          { time: '9:45', event: 'Touchdown', team: 'Home', score: '21-17' },
          { time: '5:12', event: 'Fumble', team: 'Away' },
          { time: '1:08', event: 'Punt', team: 'Home' }
        ]
      },
      {
        quarter: 4,
        homeScore: 28,
        awayScore: 24,
        homeWinProb: [0.82, 0.85, 0.83, 0.80, 0.78, 0.75, 0.72, 0.70, 0.68, 0.65],
        awayWinProb: [0.18, 0.15, 0.17, 0.20, 0.22, 0.25, 0.28, 0.30, 0.32, 0.35],
        events: [
          { time: '15:00', event: 'Touchdown', team: 'Home', score: '28-17' },
          { time: '10:33', event: 'Touchdown', team: 'Away', score: '28-24' },
          { time: '7:21', event: 'Field Goal Attempt - Blocked', team: 'Away' },
          { time: '3:45', event: 'Punt', team: 'Home' },
          { time: '0:32', event: 'Game End', team: 'Final', score: '28-24' }
        ]
      }
    ]

    return quarters
  }

  const quarters = generateSimulation()
  const currentQuarterData = quarters[currentQuarter - 1]

  const winProbChartData = currentQuarterData.homeWinProb.map((prob, index) => ({
    time: `${index + 1}`,
    home: (prob * 100).toFixed(1),
    away: (currentQuarterData.awayWinProb[index] * 100).toFixed(1)
  }))

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startSimulation = () => {
    setIsSimulating(true)
    // In real app, this would trigger the Markov Chain Decision Tree simulation
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setCurrentQuarter(1)
    setGameTime(900)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2">Game Simulation</h2>
        <p className="text-gray-300">Markov Chain Decision Tree - 4 Quarter Simulation</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Kansas City Chiefs vs Buffalo Bills</h3>
            <p className="text-gray-400">Simulated Game Prediction</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Play className="h-5 w-5" />
              <span>Start Simulation</span>
            </button>
            <button
              onClick={resetSimulation}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(quarter => (
            <button
              key={quarter}
              onClick={() => setCurrentQuarter(quarter)}
              className={`p-4 rounded-lg border transition-colors ${
                currentQuarter === quarter
                  ? 'bg-blue-500/30 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-medium mb-1">Quarter {quarter}</div>
              <div className="text-2xl font-bold">
                {quarters[quarter - 1].homeScore} - {quarters[quarter - 1].awayScore}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Home Team</div>
            <div className="text-2xl font-bold text-blue-400 mb-2">Kansas City Chiefs</div>
            <div className="text-4xl font-bold text-white">{currentQuarterData.homeScore}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Away Team</div>
            <div className="text-2xl font-bold text-red-400 mb-2">Buffalo Bills</div>
            <div className="text-4xl font-bold text-white">{currentQuarterData.awayScore}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            Win Probability - Quarter {currentQuarter}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winProbChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="time" stroke="#ffffff80" label={{ value: 'Time Progression', position: 'insideBottom', offset: -5, fill: '#ffffff80' }} />
              <YAxis stroke="#ffffff80" label={{ value: 'Win Probability %', angle: -90, position: 'insideLeft', fill: '#ffffff80' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="home"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Home Win %"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="away"
                stroke="#ef4444"
                strokeWidth={2}
                name="Away Win %"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            Game Events - Quarter {currentQuarter}
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {currentQuarterData.events.map((event, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 font-medium">{event.time}</span>
                  <span className="text-white">{event.event}</span>
                </div>
                {event.score && (
                  <span className="text-blue-400 font-semibold">{event.score}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Simulation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Final Score</div>
            <div className="text-2xl font-bold text-white">
              {quarters[3].homeScore} - {quarters[3].awayScore}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Predicted Winner</div>
            <div className="text-xl font-bold text-blue-400">Kansas City Chiefs</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Final Win Probability</div>
            <div className="text-2xl font-bold text-white">
              {(quarters[3].homeWinProb[quarters[3].homeWinProb.length - 1] * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="text-sm text-gray-400 mb-1">Simulation Confidence</div>
            <div className="text-2xl font-bold text-green-400">85%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameSimulation


